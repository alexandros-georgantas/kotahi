const axios = require('axios')

const { htmlToJats } = require('../../utils/jatsUtils')

const Config = require('../../../models/config/config.model')

const DOI_PATH_PREFIX = 'https://doi.org/'

const getDataciteURL = useSandbox =>
  useSandbox === true
    ? 'https://api.test.datacite.org'
    : 'https://api.datacite.org'

const requestToDatacite = (method, path, payload, activeConfig) => {
  const url = getDataciteURL(
    activeConfig.formData.publishing.datacite.useSandbox,
  )

  const auth = Buffer.from(
    `${activeConfig.formData.publishing.datacite.login}:${activeConfig.formData.publishing.datacite.password}`,
  ).toString('base64')

  const authorization = `Basic ${auth}`

  const options = {
    method,
    url: `${url}/${path}`,
    headers: {
      accept: 'application/vnd.api+json',
      authorization,
    },
    data: {
      data: payload,
    },
  }

  return axios.request(options)
}

/** Publish either article or reviews to Datacite, according to config */
const publishToDatacite = async manuscript => {
  const activeConfig = await Config.getCached(manuscript.groupId)

  if (!activeConfig.formData.publishing.datacite.doiPrefix)
    throw new Error(
      'Could not publish to Datacite, as no DOI prefix is configured.',
    )

  if (!activeConfig.formData.publishing.datacite.publisher)
    throw new Error(
      'Could not publish to Datacite, as no publisher is configured.',
    )

  await publishArticleToDatacite(manuscript).catch(err => {
    throw err
  })
}

/** Get DOI in form 10.12345/<suffix>
 * If the configured prefix includes 'https://doi.org/' and/or a trailing slash, these are dealt with gracefully. */
const getDoi = (suffix, activeConfig) => {
  let prefix = activeConfig.formData.publishing.datacite.doiPrefix
  if (!prefix) throw new Error('No DOI prefix configured.')
  if (prefix.startsWith(DOI_PATH_PREFIX))
    prefix = prefix.replace(DOI_PATH_PREFIX, '')
  if (prefix.endsWith('/')) prefix = prefix.replace('/', '')
  if (!/^10\.\d{4,9}$/.test(prefix))
    throw new Error(
      `Unrecognised DOI prefix "${activeConfig.formData.publishing.datacite.doiPrefix}"`,
    )
  return `${prefix}/${suffix}`
}

const getContributor = author => {
  if (!author.firstName || !author.lastName)
    throw new Error(`Incomplete author record ${JSON.stringify(author)}`)

  const contributor = {
    nameType: 'Personal',
    givenName: author.firstName,
    familyName: author.lastName,
  }

  if (author.affiliation)
    contributor.affiliation = [{ name: author.affiliation }]

  return contributor
}

/** Gets issueYear from submission.issueYear or failing that, from submission.volumeNumber.
 * Checks that the year looks sensible (in range 2000-2099)
 */
// const getIssueYear = manuscript => {
//   let yearString =
//     manuscript.submission.$issueYear || manuscript.submission.$volumeNumber
//   if (typeof yearString !== 'string')
//     throw new Error('Could not determine issue year')
//   yearString = yearString.trim()

//   // Only works for years 2000-2099
//   if (!/^20\d\d$/.test(yearString))
//     throw new Error(
//       `Issue year '${yearString}' does not appear to be a valid year.`,
//     )
//   return yearString
// }

/** Returns true if a DOI is not already in use.
 * It will also return true if the Datacite server is faulty or down, so that form submission is not prevented.
 */
const doiIsAvailable = async (checkDOI, activeConfig) => {
  try {
    // Try to find object listed at DOI
    await requestToDatacite('get', `dois/${checkDOI}`, null, activeConfig)

    // eslint-disable-next-line no-console
    console.log(
      `DOI '${checkDOI}' is already taken. Custom suffix is unavailable.`,
    )
    return false // DOI is already in use
  } catch (err) {
    if (err.response.status === 404) {
      // HTTP 404 "Not found" response. The DOI is not known by Datacite
      // console.log(`DOI '${checkDOI}' is available.`)
      return true
    }

    return true
  }
}

/** Send submission to register an article, with appropriate metadata */
const publishArticleToDatacite = async manuscript => {
  const activeConfig = await Config.getCached(manuscript.groupId)

  if (!manuscript.submission)
    throw new Error('Manuscript has no submission object')
  if (!manuscript.submission.$title)
    throw new Error('Manuscript has no submission.$title')
  if (!manuscript.submission.$abstract)
    throw new Error('Manuscript has no submission.$abstract')
  if (!manuscript.submission.$authors)
    throw new Error('Manuscript has no submission.$authors field')
  if (!Array.isArray(manuscript.submission.$authors))
    throw new Error('Manuscript.submission.$authors is not an array')

  const issueYear = '2020' // getIssueYear(manuscript)
  const publishDate = new Date()

  const doiSuffix = manuscript.id

  const doi = getDoi(doiSuffix, activeConfig)

  const publishedLocation = `${activeConfig.formData.publishing.datacite.publishedArticleLocationPrefix}${manuscript.shortId}`

  const creators = manuscript.submission.$authors.map(getContributor)

  const relatedItems = []

  if (
    manuscript.submission.$volumeNumber ||
    manuscript.submission.$issueNumber
  ) {
    relatedItems.push({
      relatedItemType: 'Collection',
      relationType: 'IsPublishedIn',
      volume: manuscript.submission.$volumeNumber,
      issue: manuscript.submission.$issueNumber,
    })
  }

  const {
    journalName,
    journalAbbreviatedName,
    publisher,
    licenseUrl,
    doiPrefix,
  } = activeConfig.formData.publishing.datacite

  if (journalName || journalAbbreviatedName) {
    const titles = []

    if (journalName) {
      titles.push({
        title: journalName,
        titleType: 'TranslatedTitle',
      })
    }

    if (journalAbbreviatedName) {
      titles.push({
        title: journalAbbreviatedName,
        titleType: 'Subtitle',
      })
    }

    relatedItems.push({
      relatedItemType: 'Journal',
      relationType: 'IsPublishedIn',
      titles,
    })
  }

  const payload = {
    type: 'dois',
    attributes: {
      doi,
      event: 'publish',
      prefix: doiPrefix,
      suffix: doiSuffix,
      url: publishedLocation,
      types: { resourceTypeGeneral: 'JournalArticle' },
      creators,
      publisher: {
        name: publisher,
      },
      titles: [
        {
          title: manuscript.submission.$title,
          titleType: 'TranslatedTitle',
        },
      ],
      descriptions: [
        {
          descriptionType: 'Abstract',
          description: htmlToJats(manuscript.submission.$abstract),
        },
      ],
      dates: [
        { dateType: 'Issued', date: issueYear },
        { dateType: 'Accepted', date: publishDate.toISOString() },
      ],
      publicationYear: publishDate.getUTCFullYear(),
      relatedItems,
      rightsList: [{ rights: licenseUrl }],
    },
  }

  if (!(await doiIsAvailable(doi, activeConfig))) {
    await requestToDatacite('put', `dois/${doi}`, payload, activeConfig)
  } else {
    await requestToDatacite('post', 'dois', payload, activeConfig)
  }
}

module.exports = {
  publishToDatacite,
  getDoi,
  doiIsAvailable,
}
