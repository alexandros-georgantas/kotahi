const axios = require('axios')
const path = require('path')
const fs = require('fs')

const {
  logger,
  pubsubManager,
  uuid,
  useTransaction,
  createFile,
  File,
  fileStorage,
} = require('@coko/server')

const { CMSFileTemplate } = require('@pubsweet/models')

const Config = require('../../config/src/config')
const { crossrefScrape } = require('./scraper')

const { getPubsub } = pubsubManager

const MAX_ENTRIES = 1000

const CONTROLLER = 'ONE MINUTE MIGRATION:'

const MIGRATION_FOLDER_NAME = 'migrations'
const JOURNALS_FOLDER_NAME = 'journals'

const getLeafFolderId = async (pathElements, parentFolder, trx) => {
  const parentIndex = pathElements.findIndex(el => el === parentFolder.name)

  const child = await CMSFileTemplate.query(trx).findOne({
    parentId: parentFolder.id,
    name: pathElements[parentIndex + 1],
  })

  if (parentIndex === pathElements.length - 2) {
    return child.id
  }

  return getLeafFolderId(pathElements, child, trx)
}

const readDirectoryRecursively = async (
  directoryPath,
  parentId,
  callBack,
  groupId,
  trx,
) => {
  const files = fs.readdirSync(directoryPath)

  await Promise.all(
    files.map(async file => {
      const filePath = path.join(directoryPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        const insertedDirectoryId = await callBack(
          filePath,
          parentId,
          false,
          true,
          groupId,
          trx,
        )

        // It's a directory, so recursively read its contents
        await readDirectoryRecursively(
          filePath,
          insertedDirectoryId,
          callBack,
          groupId,
          trx,
        )
      } else {
        // It's a file, you can perform operations on the file here
        await callBack(filePath, parentId, false, false, groupId, trx)
      }
    }),
  )
}

const insertResource = async (
  name,
  parentId,
  rootFolder,
  isDirectory,
  groupId,
  trx,
  fileContent = null,
) => {
  try {
    const insertedResource = await CMSFileTemplate.query(trx)
      .insertGraph({
        name: path.basename(name),
        parentId,
        groupId,
        rootFolder,
      })
      .returning('id')

    if (!isDirectory) {
      const insertedFile = await createFile(
        fileContent || fs.createReadStream(name),
        path.basename(name),
        null,
        null,
        ['cmsTemplateFile'],
        insertedResource.id,
        { trx },
      )

      await CMSFileTemplate.query(trx)
        .update({ fileId: insertedFile.id })
        .where({ id: insertedResource.id })
    }

    return insertedResource.id
  } catch (e) {
    logger.error('failed to insert resource', name)
    throw new Error(e)
  }
}

const createRootFolder = async (groupId, trx) => {
  const cmsFolder = await CMSFileTemplate.query(trx).findOne({
    groupId,
    parentId: null,
  })

  const existingFolder = await CMSFileTemplate.query(trx).findOne({
    name: MIGRATION_FOLDER_NAME,
    groupId,
  })

  const deleteRecursively = async parentFolder => {
    const children = await CMSFileTemplate.query(trx).where({
      parentId: parentFolder.id,
    })

    await Promise.all(
      children.map(async child => {
        if (child.fileId) {
          await CMSFileTemplate.query(trx).findOne({ id: child.id }).delete()
          const file = await File.query(trx).findOne({ id: child.fileId })
          const keys = file.storedObjects.map(f => f.key)

          try {
            if (keys.length > 0) {
              await fileStorage.deleteFiles(keys)
              await File.query(trx).deleteById(child.id)
            }
          } catch (e) {
            throw new Error('The was a problem deleting the file')
          }
        } else {
          await deleteRecursively(child)
        }
      }),
    )

    await CMSFileTemplate.query(trx).findOne({ id: parentFolder.id }).delete()
  }

  if (existingFolder) {
    await deleteRecursively(existingFolder)
  }

  const rootFolderId = await insertResource(
    MIGRATION_FOLDER_NAME,
    cmsFolder.id,
    true,
    true,
    groupId,
    trx,
    null,
  )

  await readDirectoryRecursively(
    `${__dirname}/flaxTemplateFiles/`,
    rootFolderId,
    insertResource,
    groupId,
    trx,
  )

  const dataPathElements = `${MIGRATION_FOLDER_NAME}/data`.split('/')
  const contentPathElements = `${MIGRATION_FOLDER_NAME}/content`.split('/')

  const dataFolderId = await getLeafFolderId(
    dataPathElements,
    {
      id: rootFolderId,
      name: MIGRATION_FOLDER_NAME,
    },
    trx,
  )

  const contentFolderId = await getLeafFolderId(
    contentPathElements,
    {
      id: rootFolderId,
      name: MIGRATION_FOLDER_NAME,
    },
    trx,
  )

  const dataJournalsFolderId = await insertResource(
    `${MIGRATION_FOLDER_NAME}/data/${JOURNALS_FOLDER_NAME}/`,
    dataFolderId,
    false,
    true,
    groupId,
    trx,
  )

  const contentJournalsFolderId = await insertResource(
    `${MIGRATION_FOLDER_NAME}/data/${JOURNALS_FOLDER_NAME}/`,
    contentFolderId,
    false,
    true,
    groupId,
    trx,
  )

  return { dataJournalsFolderId, contentJournalsFolderId, rootFolderId }
}

const reorderPerIssue = data => {
  const reorderedData = data.sort((a, b) => {
    if (a.volume !== b.volume) {
      return b.volume - a.volume
    }

    return typeof b.issue === 'number'
      ? b.issue - a.issue
      : b.issue?.localeCompare(a.issue) || 0
  })

  return reorderedData
}

const reconstructVolumes = data => {
  const volumes = {}

  data.forEach((item, index) => {
    const { volume, issue = '1', ...content } = item

    if (!volumes[volume]) {
      volumes[volume] = []
    }

    const issueObj = volumes[volume].find(i => i.number === issue)

    if (!issueObj) {
      volumes[volume].push({ number: issue, articles: [] })
    }

    volumes[volume]
      .find(i => i.number === issue)
      .articles.push({ issue, volume, ...content })
  })

  const reconstructedVolumes = Object.entries(volumes).map(
    ([volume, issues]) => {
      const sortedIssues = issues.sort((a, b) =>
        a.number.localeCompare(b.number),
      )

      return { volume, issues: sortedIssues }
    },
  )

  return reconstructedVolumes
}

const scrapeMetaPage = async (doi, groupId) => {
  const doiUrl = `https://doi.org/${doi}`
  const scrapedPages = await crossrefScrape(doiUrl, groupId)
  return JSON.stringify(scrapedPages, null, 2)
}

const crossrefApiCall = async (
  issn,
  groupId = uuid(),
  dataJournalsFolderId,
  contentJournalsFolderId,
  trx,
) => {
  const BASE_MESSAGE = `${CONTROLLER} crossrefApiCall:`

  const formattedIssn = issn.replace('-', '')
  const pubsub = await getPubsub()

  const activeConfig = await Config.query().findOne({
    groupId,
    active: true,
  })

  const crossrefRetrievalEmail =
    activeConfig?.formData.production?.crossrefRetrievalEmail || ''

  const metadataUrl = `https://api.crossref.org/journals/${issn}/`
  const contentUrl = `https://api.crossref.org/journals/${issn}/works?select=DOI,page,title,link,issue,volume,abstract,type,author&rows=${MAX_ENTRIES}`

  const headers = {
    'User-Agent': `Kotahi (Axios 0.21; mailto:${crossrefRetrievalEmail})`,
  }

  const articleContent = `---
title: "The article" 
issn: "${formattedIssn}"
pagination:
  data: journals[${formattedIssn}]
  size: 1
  alias: article
permalink: "/articles/{{issn}}/{{article.DOI}}/index.html"
layout: "crossref/crossref-journal-single.njk"
--- `

  const volumeIndex = `---
title: "Back issues"
issn: "${formattedIssn}"
permalink: "/articles/${formattedIssn}/volumes/index.html"
layout: "crossref/crossref-volume-index.njk"
menu: "Back issues"
---`

  // the content for the archive pages in flax
  const archiveContent = `---
title: "Archives"
issn: "${formattedIssn}"
pagination:
  data: journals[${formattedIssn}]
  size: 10
  alias: article
permalink: "/articles/{{issn}}/archives/{{pagination.pageNumber}}/index.html"
layout: "crossref/crossref-journal-archive.njk"
menu: "Archives"
--- `

  // the content for the current page [the latest issue?] chosen by the layout file.
  // we could change the layout from a cli question: order?
  const currentContent = `---
title:  "Current"
issn: "${formattedIssn}"
layout: crossref/crossref-journal-index.njk
permalink: "/articles/${formattedIssn}/index.html"
menu: "Current"
---
`

  // the content for the health page in flax
  const indexHealth = `---
title: health check
issn: "${formattedIssn}"
layout: crossref/crossref-meta-health-check.njk
permalink: "/articles/${formattedIssn}/health.html"
menufooter: "health check"
---`

  // the content for the about page in flax
  const aboutPage = `---
title: "About"
issn: "${formattedIssn}"
layout: crossref/crossref-about.njk
permalink: "/articles/${formattedIssn}/about.html"
menu: "About"
---`

  // the content for the about page in flax
  const homePage = `---
title: "homepage"
issn: "${formattedIssn}"
layout: crossref/crossref-home.njk
permalink: "/"
---`

  // the content for the about page in flax
  const teamPage = `---
title: "Team"
issn: "${formattedIssn}"
layout: crossref/crossref-team.njk
permalink: "/articles/${formattedIssn}/team.html"
menu: "Team"
---`

  const metadata = await axios
    .get(metadataUrl, { headers })
    .then(async res => {
      const { message } = res.data

      pubsub.publish(`MIGRATION_STAT_${groupId}`, {
        migrationStatusUpdate: 'savingMetadata',
      })

      pubsub.publish(`MIGRATION_META_${groupId}`, {
        migrationTitleAndPublisher: {
          title: message.title,
          publisher: message.publisher,
        },
      })

      const stringifiedMetadata = `${JSON.stringify(message, null, 2)}`

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/data/journals/${formattedIssn}meta.json`,
        dataJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        stringifiedMetadata,
      )

      return message
    })
    .catch(e => {
      const errMessage = e.response
        ? `${e.response.status} ${e.response.statusText}`
        : e

      logger.error(
        `${BASE_MESSAGE} failed to get metadata for journal ${issn}: ${errMessage}`,
      )

      //   console.log({ error: e.response.status })
      throw new Error(e.response.status)
    })

  if (!metadata) {
    return null
  }

  const processedItems = await axios
    .get(contentUrl, { headers })
    .then(async res => {
      const { message } = res.data

      pubsub.publish(`MIGRATION_STAT_${groupId}`, {
        migrationStatusUpdate: 'sortingJournal',
      })

      const reorderedItems = reorderPerIssue(message.items)
      const stringifiedItems = JSON.stringify(reorderedItems)

      const volumes = JSON.stringify(reconstructVolumes(message.items), null, 2)

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/data/journals/${formattedIssn}volumes.json`,
        dataJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        volumes,
      )

      const scrapedMetadata = await scrapeMetaPage(
        message.items[0].DOI,
        groupId,
      )

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/data/journals/${formattedIssn}scrap.json`,
        dataJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        scrapedMetadata,
      )

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/data/journals/${formattedIssn}.json`,
        dataJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        stringifiedItems,
      )

      pubsub.publish(`MIGRATION_STAT_${groupId}`, {
        migrationStatusUpdate: 'metadataSaved',
      })

      // create the current articles page

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}current.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        currentContent,
      )

      // create the current home page

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}home.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        homePage,
      )

      // create the archives article page

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}archives.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        archiveContent,
      )

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}articles.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        articleContent,
      )

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}health.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        indexHealth,
      )

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}about.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        aboutPage,
      )

      // create the archives per volume page

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}backissues.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        volumeIndex,
      )

      // create the team page

      await insertResource(
        `${MIGRATION_FOLDER_NAME}/content/journals/${formattedIssn}team.md`,
        contentJournalsFolderId,
        false,
        false,
        groupId,
        trx,
        teamPage,
      )

      return stringifiedItems
    })
    .catch(err => {
      logger.error(err)
      throw new Error(err)
    })

  return processedItems
}

const startMigration = async (issn, groupId) => {
  return useTransaction(async trx => {
    // remove previous data
    const pubsub = await getPubsub()

    pubsub.publish(`MIGRATION_STAT_${groupId}`, {
      migrationStatusUpdate: 'removingPreviousMigration',
    })

    const {
      dataJournalsFolderId,
      contentJournalsFolderId,
    } = await createRootFolder(groupId, trx)

    const link = await crossrefApiCall(
      issn,
      groupId,
      dataJournalsFolderId,
      contentJournalsFolderId,
      trx,
    )

    return link
  }).catch(e => {
    logger.error('one minute migration failed', e)
    throw new Error(e)
  })
}

module.exports = { startMigration }
