const models = require('@pubsweet/models')

const { fileStorage } = require('@coko/server')

const File = require('@coko/server/src/models/file/file.model')

const fs = require('fs')

const {
  replaceImageSrc,
  getFilesWithUrl,
} = require('../../utils/fileStorageUtils')

const languages = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../app/i18n/languages.json`, 'utf8'),
)

const setInitialLayout = async groupId => {
  const { formData } = await models.Config.getCached(groupId)
  const { primaryColor, secondaryColor } = formData.groupIdentity

  const layout = await new models.CMSLayout({
    primaryColor,
    secondaryColor,
    groupId,
  }).save()

  return layout
}

const getFlaxPageConfig = async (configKey, groupId) => {
  const pages = await models.CMSPage.query()
    .where('groupId', groupId)
    .select(['id', 'title', 'url', configKey])
    .orderBy('title')

  if (!pages) return []
  return pages.map(page => ({
    id: page.id,
    title: page.title,
    url: page.url,
    // shownInMenu: page[configKey].shownInMenu,
    // sequenceIndex: page[configKey].sequenceIndex,
    config: page[configKey],
  }))
}

const setFileUrls = storedObjects => {
  const updatedStoredObjects = []
  /* eslint-disable no-await-in-loop */
  Object.keys(storedObjects).forEach(async key => {
    const storedObject = storedObjects[key]
    storedObject.url = await fileStorage.getURL(storedObject.key)
    updatedStoredObjects.push(storedObject)
  })

  return updatedStoredObjects
}

const addSlashes = inputString => {
  let str = inputString

  if (!inputString.startsWith('/')) {
    str = `/${inputString}`
  }

  if (!inputString.endsWith('/')) {
    str = `${inputString}/`
  }

  return str
}

const cleanCMSPageInput = inputData => {
  if (!inputData.url) return inputData
  const attrs = { ...inputData }
  attrs.url = addSlashes(inputData.url)
  return inputData
}

const resolvers = {
  Query: {
    async cmsPages(_, vars, ctx) {
      const groupId = ctx.req.headers['group-id']

      const cmsPages = await models.CMSPage.query()
        .where('groupId', groupId)
        .orderBy('title')

      return cmsPages
    },

    async cmsPage(_, { id }, _ctx) {
      const cmsPage = await models.CMSPage.query().findById(id)
      return cmsPage
    },

    async cmsLayout(_, _vars, ctx) {
      const groupId = ctx.req.headers['group-id']
      let layout = await models.CMSLayout.query()
        .where('groupId', groupId)
        .first()

      if (!layout) {
        layout = await setInitialLayout(groupId)
      }

      return layout
    },
  },
  Mutation: {
    async createCMSPage(_, { input }, ctx) {
      try {
        const groupId = ctx.req.headers['group-id']

        const savedCmsPage = await new models.CMSPage(
          cleanCMSPageInput({ ...input, groupId }),
        ).save()

        const cmsPage = await models.CMSPage.query().findById(savedCmsPage.id)
        return { success: true, error: null, cmsPage }
      } catch (e) {
        if (e.constraint === 'cms_pages_url_group_id_key') {
          return {
            success: false,
            error: e.constraint,
            column: 'url',
            errorMessage: 'Url already taken.',
          }
        }

        return { success: false, error: 'Something went wrong.' }
      }
    },

    async updateCMSPage(_, { id, input }, ctx) {
      const attrs = cleanCMSPageInput(input)

      if (!input.creatorId) {
        attrs.creatorId = ctx.user
      }

      const cmsPage = await models.CMSPage.query().updateAndFetchById(id, attrs)
      return cmsPage
    },

    async deleteCMSPage(_, { id }, ctx) {
      try {
        const response = await models.CMSPage.query().where({ id }).delete()

        if (response) {
          return {
            success: true,
          }
        }

        return {
          success: false,
          error: `Something went wrong`,
        }
      } catch (err) {
        return {
          success: false,
          error: `Something went wrong. ${err.message}`,
        }
      }
    },

    async updateCMSLayout(_, { _id, input }, ctx) {
      const groupId = ctx.req.headers['group-id']

      const layout = await models.CMSLayout.query()
        .where('groupId', groupId)
        .first()

      if (!layout) {
        const savedCmsLayout = await new models.CMSLayout(input).save()

        const cmsLayout = await models.CMSLayout.query().findById(
          savedCmsLayout.id,
        )

        return cmsLayout
      }

      const cmsLayout = await models.CMSLayout.query().updateAndFetchById(
        layout.id,
        input,
      )

      return cmsLayout
    },
  },

  CMSPage: {
    async meta(parent) {
      if (parent.meta) {
        return JSON.stringify(parent.meta)
      }

      return null
    },

    async creator(parent) {
      if (!parent.creatorId) {
        return null
      }

      return models.CMSPage.relatedQuery('creator').for(parent.id).first()
    },

    async content(parent) {
      if (!parent.content) return parent.content

      let files = await models.File.query().where('object_id', parent.id)
      files = await getFilesWithUrl(files)

      const replacedImagesLangObj = {}

      Object.keys(parent.content).forEach(async key => {
        const value = parent.content[key]

        if (typeof value === 'string') {
          replacedImagesLangObj[key] = await replaceImageSrc(
            value,
            files,
            'medium',
          )
        }
      })

      return replacedImagesLangObj
    },
  },

  CMSLayout: {
    async logo(parent) {
      if (Object.keys(parent.logoId).length === 0) {
        return null
      }

      const logos = {}
      /* eslint-disable no-await-in-loop */
      await Promise.all(
        Object.keys(parent.logoId).map(async key => {
          const fileId = parent.logoId[key]
          const file = await models.File.query().where('id', fileId).first()
          const updatedStoredObjects = setFileUrls(file.storedObjects)
          file.storedObjects = updatedStoredObjects
          logos[key] = file
        }),
      )
      return logos
    },

    async flaxHeaderConfig(parent) {
      return getFlaxPageConfig('flaxHeaderConfig', parent.groupId)
    },

    async flaxFooterConfig(parent) {
      const res = await getFlaxPageConfig('flaxFooterConfig', parent.groupId)
      return res
    },

    async publishConfig(parent) {
      const { formData } = await models.Config.getCached(parent.groupId)

      return JSON.stringify({
        licenseUrl: formData.publishing.crossref.licenseUrl,
      })
    },

    async languagesWithLabels(parent) {
      let withLabels = []

      if (parent.languages.length) {
        withLabels = parent.languages.map(langKey => ({
          value: langKey,
          label: languages[langKey],
        }))
      }

      return withLabels
    },
  },

  StoredPartner: {
    async file(parent) {
      try {
        const file = await File.find(parent.id)
        const updatedStoredObjects = setFileUrls(file.storedObjects)
        file.storedObjects = updatedStoredObjects
        return file
      } catch (err) {
        return null
      }
    },
  },
}

// input CMSPageInput {
//     title: String
//     url: String
//     content: String
//     published: DateTime
//     edited: DateTime
//     flaxHeaderConfig: FlaxConfigInput
//     flaxFooterConfig: FlaxConfigInput
//   }
const typeDefs = `
  extend type Query {
    cmsPage(id: ID!): CMSPage!
    cmsPages: [CMSPage!]!
    cmsLayout: CMSLayout!
  }

  extend type Mutation {
    createCMSPage(input: CMSPageInput!): CreatePageResponse!
    updateCMSPage(id: ID!, input: CMSPageInput!): CMSPage!
    deleteCMSPage(id: ID!): DeletePageResponse!
    updateCMSLayout(input: CMSLayoutInput!): CMSLayout!
  }

  type CMSPage {
    id: ID!
    url: String!
    title: JSON!
    status: String!
    content: JSON
    meta: String
    creator: User
    published: DateTime
    edited: DateTime
    created: DateTime!
    updated: DateTime
    flaxHeaderConfig: JSON!
    flaxFooterConfig: JSON!
  }

  type CreatePageResponse {
    cmsPage: CMSPage
    success: Boolean!
    column: String
    error: String
    errorMessage: String
  }


  type DeletePageResponse {
    success: Boolean!
    error: String
  }

  type StoredPartner {
    id: ID!
    url: String
    sequenceIndex: Int
    file: File
  }
  scalar JSON
  type CMSLayout {
    id: ID!
    active: Boolean!
    primaryColor: JSON!
    secondaryColor: JSON!
    logo: JSON
    partners: [StoredPartner!]
    footerText: JSON
    published: DateTime
    edited: DateTime!
    created: DateTime!
    updated: DateTime
    flaxHeaderConfig: [FlaxPageHeaderConfig!]
    flaxFooterConfig: [FlaxPageFooterConfig!]
    publishConfig: String!
    languages: [String]
    languagesWithLabels: [JSON]
  }

  type FlaxPageHeaderConfig {
    id: ID!
    title: JSON!
    url: String!
    sequenceIndex: Int
    shownInMenu: Boolean
    config: JSON
  }

  type LanguageTexts {
    en: String
  }

  type FlaxPageFooterConfig {
    id: ID!
    title: JSON!
    url: String!
    sequenceIndex: Int
    shownInMenu: Boolean
    config: JSON
  }

  input CMSPageInput {
    title: JSON
    url: String
    content: JSON
    published: DateTime
    edited: DateTime
    flaxHeaderConfig: JSON
    flaxFooterConfig: JSON
  }

  input StoredPartnerInput {
    id: ID!
    url: String
    sequenceIndex: Int 
  }


  input CMSLayoutInput {
    primaryColor: JSON
    secondaryColor: JSON
    logoId: JSON
    partners: [StoredPartnerInput]
    footerText: JSON
    published: DateTime
    edited: DateTime
    languages: [String]
  }

  input FlaxConfigInput {
    sequenceIndex: Int
    shownInMenu: Boolean
  }
`

module.exports = { resolvers, typeDefs }
