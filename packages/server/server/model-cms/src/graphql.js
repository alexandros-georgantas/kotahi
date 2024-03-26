const models = require('@pubsweet/models')
const fnv = require('fnv-plus')

const File = require('@coko/server/src/models/file/file.model')

const {
  replaceImageSrc,
  replaceImageFromNunjucksTemplate,
  getFilesWithUrl,
  setFileUrls,
} = require('../../utils/fileStorageUtils')

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
      let layouts = await models.CMSLayout.query()
        .where({ groupId })
        .orderBy('language')
      if (!layouts.length) layouts = [await setInitialLayout(groupId)] // TODO move this to seedArticleTemplate.js or similar

      // Munge into a single object. // TODO migrate the DB to this structure too
      const first = layouts[0]

      return {
        id: groupId,
        created: first.created,
        updated: first.updated,
        edited: first.edited,
        published: first.published,
        active: first.active,
        hexCode: first.isPrivate ? fnv.hash(groupId) : null,
        isPrivate: first.isPrivate,
        languageLayouts: layouts.map(x => ({
          id: x.id,
          article: x.article ?? '',
          css: x.css ?? '',
          flaxFooterConfig: x.flaxFooterConfig ?? [],
          flaxHeaderConfig: x.flaxHeaderConfig ?? [],
          footerText: x.footerText,
          language: x.language,
          logo: x.logo,
          favicon: x.favicon,
          partnerFiles: x.partnerFiles,
          partners: x.partners ?? [],
          primaryColor: x.primaryColor,
          secondaryColor: x.secondaryColor,
          publishConfig: x.publishConfig,
        })),
      }
    },
    /** @deprecated Use cmsLayout */
    async cmsLayouts(_, _vars, ctx) {
      const groupId = ctx.req.headers['group-id']
      let layouts = await models.CMSLayout.query().where('groupId', groupId)

      if (!layouts.length) {
        layouts = [await setInitialLayout(groupId)] // TODO move this to seedArticleTemplate.js or similar
      }

      return layouts
    },

    /** @deprecated */
    async cmsLanguages(_, _vars, ctx) {
      const groupId = ctx.req.headers['group-id']
      const result = await models.CMSLanguageList.query().findOne({ groupId })
      return result.languages
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
    async updateCmsLayout(_, { input }, ctx) {
      const groupId = ctx.req.headers['group-id']
      await models.CMSLayout.query()
        .patch({
          active: input.active,
          isPrivate: input.isPrivate,
          hexCode: input.hexCode,
          published: input.published,
          edited: input.edited,
        })
        .where({ groupId })

      await Promise.all(
        input.languageLayouts.map(x => {
          return models.CMSLayout.query().upsertGraphAndFetch({
            id: x.id,
            language: x.language,
            article: x.article,
            css: x.css,
            primaryColor: x.primaryColor,
            secondaryColor: x.secondaryColor,
            partners: x.partners,
            footerText: x.footerText,
            publishConfig: x.publishConfig,
          })
        }),
      )
    },
    /** @deprecated Use updateCmsLayout */
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

    /** @deprecated */
    async updateCMSLanguages(_, { languages }, ctx) {
      const groupId = ctx.req.headers['group-id']
      await models.CMSLanguageList.query()
        .patch({ languages })
        .where({ groupId })
      return true
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

      return models.CMSPage.relatedQuery('creator').for(parent.id).first()
    },

    async content(parent) {
      if (!parent.content) return parent.content

      let files = await models.File.query().where('object_id', parent.id)
      files = await getFilesWithUrl(files)

      return replaceImageSrc(parent.content, files, 'medium')
    },
  },

  CMSLayout: {
    async logo(parent) {
      if (!parent.logoId) {
        return null
      }

      const logoFile = await models.CMSLayout.relatedQuery('logo')
        .for(parent.id)
        .first()

      const updatedStoredObjects = await setFileUrls(logoFile.storedObjects)

      logoFile.storedObjects = updatedStoredObjects
      return logoFile
    },
    async favicon(parent, _, ctx) {
      try {
        const { groupId } = parent

        const activeConfig = await models.Config.query().findOne({
          groupId,
          active: true,
        })

        const file = await File.find(
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
      const { formData } = await models.Config.getCached(parent.groupId)

      return JSON.stringify({
        licenseUrl: formData.publishing.crossref.licenseUrl,
      })
    },

    async article(parent) {
      if (parent.article || parent.article === '') return parent.article

      const { article } = await models.ArticleTemplate.query().findOne({
        groupId: parent.groupId,
        isCms: true,
      })

      let files = await models.File.query().where({ objectId: parent.groupId })
      files = await getFilesWithUrl(files)

      return replaceImageFromNunjucksTemplate(article, files, 'medium') ?? ''
    },

    async css(parent) {
      if (parent.css || parent.css === '') return parent.css

      const { css } = await models.ArticleTemplate.query().findOne({
        groupId: parent.groupId,
        isCms: true,
      })

      return css ?? ''
    },
  },

  StoredPartner: {
    async file(parent) {
      try {
        const file = await File.find(parent.id)
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
    cmsLayout: CmsLayout!
    cmsLayouts: [CMSLayout!]!
    cmsLanguages: [String!]!
  }

  extend type Mutation {
    createCMSPage(input: CMSPageInput!): CreatePageResponse!
    updateCMSPage(id: ID!, input: CMSPageInput!): CMSPage!
    deleteCMSPage(id: ID!): DeletePageResponse!
    updateCMSLayout(input: CMSLayoutInput!): CMSLayout!
    updateCmsLayout(input: CmsLayoutInput!): CmsLayout!
    updateCMSLanguages(languages: [String!]!): Boolean!
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
    language: String!
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
    partners: [StoredPartner!]!
    footerText: String
    isPrivate:Boolean
    hexCode: String
    published: DateTime
    edited: DateTime!
    created: DateTime!
    updated: DateTime
    flaxHeaderConfig: [FlaxPageHeaderConfig!]!
    flaxFooterConfig: [FlaxPageFooterConfig!]!
    publishConfig: String!
    article: String!
    css: String!
    language: String!
  }

  type CmsLayout {
    id: ID!
    active: Boolean!
    languageLayouts: [CmsLanguageLayout!]!
    isPrivate: Boolean
    hexCode: String
    published: DateTime
    edited: DateTime!
    created: DateTime!
    updated: DateTime
  }

  type CmsLanguageLayout {
    id: ID!
    language: String!
    article: String!
    css: String!
    primaryColor: String!
    secondaryColor: String!
    logo: File
    favicon: File
    partners: [StoredPartner!]!
    footerText: String
    flaxHeaderConfig: [FlaxPageHeaderConfig!]!
    flaxFooterConfig: [FlaxPageFooterConfig!]!
    publishConfig: String!
  }

  input CmsLayoutInput {
    id: ID!
    active: Boolean!
    languageLayouts: [CmsLanguageLayoutInput!]!
    isPrivate: Boolean
    hexCode: String
    published: DateTime
    edited: DateTime!
  }

  input CmsLanguageLayoutInput {
    id: ID!
    language: String!
    article: String!
    css: String!
    primaryColor: String!
    secondaryColor: String!
    partners: [StoredPartnerInput!]!
    footerText: String
    publishConfig: String!
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
    language: String!
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
    language: String!
  }

  input FlaxConfigInput {
    sequenceIndex: Int
    shownInMenu: Boolean
  }
`

module.exports = { resolvers, typeDefs }
