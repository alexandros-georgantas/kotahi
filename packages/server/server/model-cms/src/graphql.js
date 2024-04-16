const File = require('@coko/server/src/models/file/file.model')

const CMSPage = require('../../../models/cmsPage/cmsPage.model')
const CMSLayout = require('../../../models/cmsLayout/cmsLayout.model')
const Config = require('../../../models/config/config.model')
const ArticleTemplate = require('../../../models/articleTemplate/articleTemplate.model')

const {
  replaceImageSrc,
  replaceImageFromNunjucksTemplate,
  getFilesWithUrl,
  setFileUrls,
} = require('../../utils/fileStorageUtils')

const setInitialLayout = async groupId => {
  const { formData } = await Config.getCached(groupId)
  const { primaryColor, secondaryColor } = formData.groupIdentity

  const layout = await CMSLayout.query().insert({
    primaryColor,
    secondaryColor,
    groupId,
  })

  return layout
}

const getFlaxPageConfig = async (configKey, groupId) => {
  const pages = await CMSPage.query()
    .where('groupId', groupId)
    .select(['id', 'title', 'url', configKey])
    .orderBy('title')

  if (!pages) return []

  return pages
    .map(page => ({
      id: page.id,
      title: page.title,
      url: page.url,
      shownInMenu: page[configKey].shownInMenu,
      sequenceIndex: page[configKey].sequenceIndex,
    }))
    .sort((page1, page2) => {
      if (page1.sequenceIndex < page2.sequenceIndex) return -1
      if (page1.sequenceIndex > page2.sequenceIndex) return 1
      return 0
    })
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

      const cmsPages = await CMSPage.query()
        .where('groupId', groupId)
        .orderBy('title')

      return cmsPages
    },

    async cmsPage(_, { id }, _ctx) {
      const cmsPage = await CMSPage.query().findById(id)
      return cmsPage
    },

    async cmsLayout(_, _vars, ctx) {
      const groupId = ctx.req.headers['group-id']
      let layout = await CMSLayout.query().where('groupId', groupId).first()

      if (!layout) {
        layout = await setInitialLayout(groupId) // TODO move this to seedArticleTemplate.js or similar
      }

      return layout
    },
  },
  Mutation: {
    async createCMSPage(_, { input }, ctx) {
      try {
        const groupId = ctx.req.headers['group-id']

        const savedCmsPage = await CMSPage.query().insert(
          cleanCMSPageInput({ ...input, groupId }),
        )

        const cmsPage = await CMSPage.query().findById(savedCmsPage.id)
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

      const cmsPage = await CMSPage.query().updateAndFetchById(id, attrs)
      return cmsPage
    },

    async deleteCMSPage(_, { id }, ctx) {
      try {
        const response = await CMSPage.query().delete().where({ id })

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

      const layout = await CMSLayout.query().where('groupId', groupId).first()

      if (!layout) {
        const savedCmsLayout = await CMSLayout.query().insert(input)

        const cmsLayout = await CMSLayout.query().findById(savedCmsLayout.id)

        return cmsLayout
      }

      const cmsLayout = await CMSLayout.query().updateAndFetchById(
        layout.id,
        input,
      )

      return cmsLayout
    },
  },

  CMSPage: {
    async meta(parent) {
      if (parent.meta) {
        return JSON.stringify({
          ...parent.meta,
          title: parent.submission.$title,
          abstract: parent.submission.$abstract,
        }) // TODO update flax so we can remove these bogus title and abstract fields
      }

      return null
    },

    async creator(parent) {
      if (!parent.creatorId) {
        return null
      }

      return CMSPage.relatedQuery('creator').for(parent.id).first()
    },

    async content(parent) {
      if (!parent.content) return parent.content

      let files = await File.query().where('object_id', parent.id)
      files = await getFilesWithUrl(files)

      return replaceImageSrc(parent.content, files, 'medium')
    },
  },

  CMSLayout: {
    async logo(parent) {
      if (!parent.logoId) {
        return null
      }

      const logoFile = await CMSLayout.relatedQuery('logo')
        .for(parent.id)
        .first()

      const updatedStoredObjects = await setFileUrls(logoFile.storedObjects)

      logoFile.storedObjects = updatedStoredObjects
      return logoFile
    },
    async favicon(parent, _, ctx) {
      try {
        const { groupId } = parent

        const activeConfig = await Config.query().findOne({
          groupId,
          active: true,
        })

        const file = await File.findById(
          activeConfig.formData.groupIdentity.favicon,
        )

        file.storedObjects = await setFileUrls(file.storedObjects)
        return file
      } catch (error) {
        return null
      }
    },

    async flaxHeaderConfig(parent) {
      return getFlaxPageConfig('flaxHeaderConfig', parent.groupId)
    },

    async flaxFooterConfig(parent) {
      return getFlaxPageConfig('flaxFooterConfig', parent.groupId)
    },

    async publishConfig(parent) {
      const { formData } = await Config.getCached(parent.groupId)

      return JSON.stringify({
        licenseUrl: formData.publishing.crossref.licenseUrl,
      })
    },

    async article(parent) {
      if (parent.article || parent.article === '') return parent.article

      const { article } = await ArticleTemplate.query().findOne({
        groupId: parent.groupId,
        isCms: true,
      })

      let files = await File.query().where({ objectId: parent.groupId })
      files = await getFilesWithUrl(files)

      return replaceImageFromNunjucksTemplate(article, files, 'medium') ?? ''
    },

    async css(parent) {
      if (parent.css || parent.css === '') return parent.css

      const { css } = await ArticleTemplate.query().findOne({
        groupId: parent.groupId,
        isCms: true,
      })

      return css ?? ''
    },
  },

  StoredPartner: {
    async file(parent) {
      try {
        const file = await File.findById(parent.id)
        const updatedStoredObjects = await setFileUrls(file.storedObjects)
        file.storedObjects = updatedStoredObjects
        return file
      } catch (err) {
        return null
      }
    },
  },
}

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
    title: String!
    status: String!
    content: String
    meta: String
    creator: User
    published: DateTime
    edited: DateTime
    created: DateTime!
    updated: DateTime
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

  type CMSLayout {
    id: ID!
    active: Boolean!
    primaryColor: String!
    secondaryColor: String!
    logo: File
    favicon: File
    partners: [StoredPartner!]
    footerText: String
    isPrivate:Boolean
    hexCode: String
    published: DateTime
    edited: DateTime!
    created: DateTime!
    updated: DateTime
    flaxHeaderConfig: [FlaxPageHeaderConfig!]
    flaxFooterConfig: [FlaxPageFooterConfig!]
    publishConfig: String!
    article: String!
    css: String!
  }

  type FlaxPageHeaderConfig {
    id: ID!
    title: String!
    url: String!
    sequenceIndex: Int
    shownInMenu: Boolean
  }

  type FlaxPageFooterConfig {
    id: ID!
    title: String!
    url: String!
    sequenceIndex: Int
    shownInMenu: Boolean
  }

  input CMSPageInput {
    title: String
    url: String
    content: String
    published: DateTime
    edited: DateTime
    flaxHeaderConfig: FlaxConfigInput
    flaxFooterConfig: FlaxConfigInput
  }

  input StoredPartnerInput {
    id: ID!
    url: String
    sequenceIndex: Int 
  }

  input CMSLayoutInput {
    primaryColor: String
    secondaryColor: String
    logoId: String
    isPrivate: Boolean
    hexCode: String
    partners: [StoredPartnerInput]
    footerText: String
    published: DateTime
    edited: DateTime
  }

  input FlaxConfigInput {
    sequenceIndex: Int
    shownInMenu: Boolean
  }
`

module.exports = { resolvers, typeDefs }
