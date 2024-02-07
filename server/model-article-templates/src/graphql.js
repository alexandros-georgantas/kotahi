const models = require('@pubsweet/models')
const { uploadFileHandler } = require('@coko/server/src/services/fileStorage')
const axios = require('axios')
const { Readable } = require('stream')

const {
  getFilesWithUrl,
  getFileWithUrl,
} = require('../../utils/fileStorageUtils')

const searchArticleTemplate = async groupId => {
  const groupFiles = await models.CMSFileTemplate.query().where({
    groupId,
  })

  const rootNode = groupFiles.find(gf => gf.parentId === null)

  const layoutsFolder = groupFiles.find(
    gf => gf.parentId === rootNode.id && gf.name === 'layouts',
  )

  return groupFiles.find(
    gf => gf.parentId === layoutsFolder.id && gf.name === 'article-preview.njk',
  )
}

const resolvers = {
  Query: {
    articleTemplate: async (_, { groupId, isCms = false }) => {
      return models.ArticleTemplate.query()
        .findOne({ groupId, isCms })
        .throwIfNotFound()
    },
  },
  Mutation: {
    async updateTemplate(_, { id, input }) {
      const result = await models.ArticleTemplate.query().findOne({ id })

      // Needs to be revisited. This is a temp Solution
      // In case we want to update the article template of the CMS we need to do that on the S3
      // Not in ArticleTemplate table
      if (result.isCms === true) {
        const articleFile = await searchArticleTemplate(result.groupId)
        const file = await models.File.query().findById(articleFile.fileId)

        const { key, mimetype } = file.storedObjects.find(
          obj => obj.type === 'original',
        )

        await uploadFileHandler(Readable.from(input.article), key, mimetype)

        // eslint-disable-next-line no-param-reassign
        input.article = ''
      }

      return models.ArticleTemplate.query()
        .patchAndFetchById(id, input)
        .throwIfNotFound()
    },
  },
  ArticleTemplate: {
    async files(articleTemplate) {
      return getFilesWithUrl(
        await models.File.query().where({ objectId: articleTemplate.groupId }),
      )
    },
    async article(articleTemplate) {
      if (articleTemplate.isCms === true) {
        const articleFile = await searchArticleTemplate(articleTemplate.groupId)
        const file = await models.File.query().findById(articleFile.fileId)

        const { storedObjects } = await getFileWithUrl(file)

        const fileUrl = storedObjects.find(f => f.type === 'original')

        const response = await axios({
          method: 'get',
          url: fileUrl.url,
        })

        return response.data.toString()
      }

      return articleTemplate.article
    },
  },
}

const typeDefs = `
  extend type Query {
    articleTemplate(groupId: ID!, isCms: Boolean!): ArticleTemplate!
  }

  extend type Mutation {
    updateTemplate(id: ID!, input: UpdateTemplateInput!): ArticleTemplate!
  }

  type ArticleTemplate {
    id: ID!
    created: DateTime!
    updated: DateTime
    name: String
    article: String!
    css: String!
    groupId: ID!
    files: [File!]
  }

  input UpdateTemplateInput {
    article: String
    css: String
  }
`

module.exports = { typeDefs, resolvers }
