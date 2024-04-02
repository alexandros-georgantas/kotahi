const models = require('@pubsweet/models')

const resolvers = {
  Query: {
    async docSets(_, _vars, ctx) {
      const groupId = ctx.req.headers['group-id']
      return models.DocSet.query().where({ groupId }).orderBy('modifiedDate')
    },
    async docSet(_, { id }, _ctx) {
      return models.DocSet.query().findById(id)
    },
  },
  Mutation: {
    async upsertDocSet(_, { id, mainDocId, title, creatorId }, ctx) {
      const groupId = ctx.req.headers['group-id']
      return models.DocSet.query().upsertGraphAndFetch({
        id,
        groupId,
        mainDocId,
        title,
        creatorId,
        modifiedDate: new Date(),
      })
    },
    async deleteDocSet(_, { id }, ctx) {
      await models.DocSet.query().delete().where({ id })
      const groupId = ctx.req.headers['group-id']
      return models.Group.query().findById(groupId)
    },
    async updateDocSetModifiedDate(_, { id }, ctx) {
      return models.DocSet.query().patchAndFetchById(id, {
        modifiedDate: new Date(),
      })
    },
  },
  DocSet: {
    async mainDoc(parent, _vars, ctx) {
      return models.DocSet.relatedQuery('mainDoc').for(parent.id)
    },
    async docs(parent, _vars, ctx) {
      return models.DocSet.relatedQuery('docs').for(parent.id)
    },
    async relations(parent, _vars, ctx) {
      return models.DocSet.relatedQuery('relations').for(parent.id)
    },
  },
  Doc: {
    async versions(parent, _vars, ctx) {
      return models.Doc.relatedQuery('versions').for(parent.id)
    },
    async currentVersion(parent, _vars, ctx) {
      return models.Doc.relatedQuery('currentVersion').for(parent.id)
    },
    async oldVersions(parent, _vars, ctx) {
      return models.Doc.relatedQuery('oldVersions').for(parent.id)
    },
    async fromRelations(parent, _vars, ctx) {
      return models.Doc.relatedQuery('fromRelations').for(parent.id)
    },
    async toRelations(parent, _vars, ctx) {
      return models.Doc.relatedQuery('toRelations').for(parent.id)
    },
  },
  DocRelation: {
    async from(parent, _vars, ctx) {
      return models.DocRelation.relatedQuery('from').for(parent.id)
    },
    async to(parent, _vars, ctx) {
      return models.DocRelation.relatedQuery('to').for(parent.id)
    },
  },
}

const typeDefs = `
  extend type Query {
    docSets: [DocSet!]!
    docSet(id: ID!): DocSet!
  }

  extend type Mutation {
    upsertDocSet(id: ID!, input: DocSetInput!): DocSet!
    deleteDocSet(id: ID!): Group!
    updateDocSetModifiedDate(id: ID!): DocSet!
  }

  type DocSet {
    id: ID!
    created: DateTime!
    updated: DateTime
    groupId: ID!
    mainDocId: ID
    title: String!
    creatorId: ID
    modifiedDate: DateTime!
    docs: [Doc!]!
    mainDoc: Doc!
    relations: [DocRelation!]!
  }

  type Doc {
    id: ID!
    created: DateTime!
    updated: DateTime
    docSetId: ID!
    groupId: ID!
    mainDocId: ID
    mainDoc: Doc!
    docs: [Doc!]!
    title: String!
    creatorId: ID
    modifiedDate: DateTime!
    versions: [DocVersion!]!
    currentVersion: DocVersion
    oldVersions: [DocVersion!]!
    fromRelations: [DocRelation!]!
    toRelations: [DocRelation!]!
  }

  type DocRelation {
    id: ID!
    created: DateTime!
    updated: DateTime
    fromId: ID!
    toId: ID!
    relationType: String!
    context: DocRelationContext!
    from: Doc!
    to: Doc!
  }

  type DocRelationContext {
    dummy: String
    # Add any desired fields here
  }

  type DocVersion {
    id: ID!
    created: DateTime!
    updated: DateTime
    docId: ID!
    creatorId: ID
    editorUserIds: [ID!]!
    isDraft: Boolean!
    lockedDate: DateTime
    data: String! # JSON field
  }

  input DocSetInput {
    id: ID!
    mainDocId: ID
    title: String!
    creatorId: ID
  }
`

module.exports = { resolvers, typeDefs }
