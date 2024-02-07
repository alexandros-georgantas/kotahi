const { pubsubManager } = require('@coko/server')
const { startMigration } = require('./oneMinuteMigration')

const { getPubsub } = pubsubManager

const resolvers = {
  Mutation: {
    async startOneMinuteMigration(_, { issn }, ctx) {
      const groupId = ctx.req.headers['group-id']
      return startMigration(issn, groupId)
    },
  },
  Subscription: {
    migrationStatusUpdate: {
      subscribe: async (_, { groupId }, ctx) => {
        const pubsub = await getPubsub()
        return pubsub.asyncIterator([`MIGRATION_STAT_${groupId}`])
      },
    },
    migrationTitleAndPublisher: {
      subscribe: async (_, { groupId }, ctx) => {
        const pubsub = await getPubsub()
        return pubsub.asyncIterator([`MIGRATION_META_${groupId}`])
      },
    },
  },
}

const typeDefs = `
  type MigrationStatus {
	status: String!
  }

  type MigrationTitleAndPublisher {
	title: String
	publisher: String
  }

  extend type Mutation {
    startOneMinuteMigration(issn: String!): String
  }

  extend type Subscription {
	migrationStatusUpdate(groupId: ID!): String!
	migrationTitleAndPublisher(groupId: ID!): MigrationTitleAndPublisher!
  }
`

module.exports = { resolvers, typeDefs }
