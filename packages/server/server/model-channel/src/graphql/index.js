const fetch = require('node-fetch')

const Channel = require('../../../../models/channel/channel.model')
const ChannelMember = require('../../../../models/channelMember/channelMember.model')

const { updateChannelLastViewed } = require('../channelCommsUtils')

const resolvers = {
  Query: {
    manuscriptChannel: async (_, { manuscriptId }, context) => {
      const manuscript = context.connectors.Manuscript.fetchOne(manuscriptId)
      return Channel.find(manuscript.channelId)
    },
    teamByName: async (_, { name }, context) => {
      const Team = context.connectors.Team.model
      return Team.query().where({ name }).eager('[channels, members]').first()
    },
    channelsByTeamName: async (_, { teamName }, context) =>
      Channel.query().joinRelated('team').where({ 'team.name': teamName }),
    channels: async () => Channel.query().where({ teamId: null }),
    findByDOI: async (_, { doi }) => Channel.query().where({ doi }).first(),
    searchOnCrossref: async (_, { searchTerm }, context) => {
      // https://api.crossref.org/works?query=renear+ontologies
      const res = await fetch(
        `https://api.crossref.org/works?query=${searchTerm}`,
      )

      const json = await res.json()

      const works = json.message.items.map(item => ({
        DOI: item.DOI,
        title: item.title.join(', '),
        author: JSON.stringify(item.author),
        year: item.created['date-time'],
      }))

      return works
    },
    systemWideDiscussionChannel: async (_, { groupId }) =>
      Channel.query()
        .whereNull('manuscriptId')
        .where({ topic: 'System-wide discussion', groupId })
        .first(),

    channelMember: async (_, { channelId }, context) => {
      return ChannelMember.query()
        .where({
          channelId,
          userId: context.user,
        })
        .first()
    },
  },
  Mutation: {
    createChannel: async (_, { name, teamId }, context) => {
      const channel = await Channel.query().insert({
        name,
        teamId,
        userId: context.user,
      })

      return channel
    },
    createChannelFromDOI: async (_, { doi }, context) => {
      const res = await fetch(`https://api.crossref.org/works/${doi}`)
      const { message: work } = await res.json()

      const channel = await Channel.query().insert({
        doi: work.DOI,
        topic: work.title.join(', '),
        userId: context.user,
      })

      return channel
    },
    changeTopic: async (_, { channelId, topic }, context) => {
      return Channel.query().patchAndFetchById(channelId, { topic })
    },
    channelViewed: async (_, { channelId }, context) => {
      return updateChannelLastViewed({ channelId, userId: context.user })
    },
  },
}

const typeDefs = `
  type Channel {
    id: String
    manuscript: Manuscript
    topic: String
    type: String
    team: Team
  }

  extend type Team {
    channels: [Channel]
  }

  type ChannelMember {
    id: ID!
    channelId: ID!
    userId: ID!
    lastViewed: DateTime
    lastAlertTriggeredTime: DateTime
  }

  type Work {
    DOI: String
    title: String
    author: String
    year: String
  }

  extend type Query {
    teamByName(name: String!): Team
    channelsByTeamName(teamName: String!): [Channel]
    findByDOI(doi: String): Channel
    searchOnCrossref(searchTerm: String): [Work]
    channels: [Channel]
    manuscriptChannel: Channel
    systemWideDiscussionChannel(groupId: ID!): Channel!
    updateChannelLastViewed: Channel!
    channelMember(channelId: ID!): ChannelMember!
  }

  extend type Mutation {
    createChannel(name: String, teamId: ID): Channel
    createChannelFromDOI(doi: String): Channel
    changeTopic(channelId: ID, topic: String): Channel
    channelViewed(channelId: ID!): ChannelMember
  }
`

module.exports = { typeDefs, resolvers }
