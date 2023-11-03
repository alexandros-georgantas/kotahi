const models = require('@pubsweet/models')

const { getFilesWithUrl } = require('../../utils/fileStorageUtils')

const resolvers = {
  Query: {
    templateByGroupId: async (_, { groupId }) => {
      return models.ArticleTemplate.query().findOne({ groupId })
    },
  },
  Mutation: {
    async updateTemplate(_, { id, input }) {
      if (input.cssTemplate) {
        // eslint-disable-next-line no-param-reassign
        input.cssTemplate = Buffer.from(input.cssTemplate, 'utf8')
      }

      if (input.articleTemplate) {
        // eslint-disable-next-line no-param-reassign
        input.articleTemplate = Buffer.from(input.articleTemplate, 'utf8')
      }

      return models.ArticleTemplate.query().patchAndFetchById(id, input)
    },
  },
  ArticleTemplate: {
    async files(articleTemplate) {
      return getFilesWithUrl(
        await models.ArticleTemplate.relatedQuery('files').for(
          articleTemplate.id,
        ),
      )
    },
    async cssTemplate(articleTemplate) {
      return articleTemplate.cssTemplate.toString()
    },
    async articleTemplate(articleTemplate) {
      return articleTemplate.articleTemplate.toString()
    },
  },
}

const typeDefs = `
  extend type Query {
    templateByGroupId(groupId: ID!): ArticleTemplate
  }

  extend type Mutation {
    updateTemplate(id: ID!, input: updateTemplateInput!): ArticleTemplate
  }

  type ArticleTemplate {
    id: ID!
    created: DateTime!
    updated: DateTime
    name: String
    articleTemplate: String!
    cssTemplate: String!
    groupId: ID!
    files: [File!]
  }

  input updateTemplateInput {
    articleTemplate: String
    cssTemplate: String
  }
`

module.exports = { typeDefs, resolvers }
