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
      if (input.css) {
        // eslint-disable-next-line no-param-reassign
        input.css = Buffer.from(input.css, 'utf8')
      }

      if (input.article) {
        // eslint-disable-next-line no-param-reassign
        input.article = Buffer.from(input.article, 'utf8')
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
    async css(articleTemplate) {
      return articleTemplate.css.toString()
    },
    async article(articleTemplate) {
      return articleTemplate.article.toString()
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
    article: String!
    css: String!
    groupId: ID!
    files: [File!]
  }

  input updateTemplateInput {
    article: String
    css: String
  }
`

module.exports = { typeDefs, resolvers }
