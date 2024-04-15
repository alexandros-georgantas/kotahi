const File = require('@coko/server/src/models/file/file.model')

const ArticleTemplate = require('../../../models/articleTemplate/articleTemplate.model')

const { getFilesWithUrl } = require('../../utils/fileStorageUtils')

const resolvers = {
  Query: {
    articleTemplate: async (_, { groupId, isCms = false }) => {
      return ArticleTemplate.query()
        .findOne({ groupId, isCms })
        .throwIfNotFound()
    },
  },
  Mutation: {
    async updateTemplate(_, { id, input }) {
      return ArticleTemplate.query()
        .patchAndFetchById(id, input)
        .throwIfNotFound()
    },
  },
  ArticleTemplate: {
    async files(articleTemplate) {
      return getFilesWithUrl(
        await File.query().where({ objectId: articleTemplate.groupId }),
      )
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
