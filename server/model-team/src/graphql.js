const fetchedObjects = '[members.[user, alias]]'
const models = require('@pubsweet/models')
const Team = require('./team')
const TeamMember = require('./team_member')

const resolvers = {
  Query: {
    team(_, { id }, ctx) {
      return Team.query().findById(id).withGraphFetched(fetchedObjects)
    },
    teams(_, { where }, ctx) {
      return Team.query()
        .where(where || {})
        .withGraphFetched(fetchedObjects)
    },
  },
  Mutation: {
    async deleteTeam(_, { id }, ctx) {
      return Team.query().deleteById(id)
    },
    async createTeam(_, { input }, ctx) {
      // TODO Only the relate option appears to be used by insertGraphAndFetch, according to Objection docs?
      const options = {
        relate: ['members.user'],
        unrelate: ['members.user'],
        allowUpsert: '[members, members.alias]',
        eager: '[members.[user.teams, alias]]',
      }

      return Team.query().insertGraphAndFetch(input, options)
    },
    async updateTeam(_, { id, input }, ctx) {
      return Team.query().upsertGraphAndFetch(
        { id, ...input },
        {
          relate: ['members.user'],
          unrelate: ['members.user'],
          eager: 'members.user.teams', // TODO This appears to be ignored, according to Objection documentation?
        },
      )
    },
    async updateTeamMember(_, { id, input }, ctx) {
      return TeamMember.query().updateAndFetchById(id, JSON.parse(input))
    },
  },
  User: {
    teams: (parent, _, ctx) => models.User.relatedQuery('teams').for(parent.id),
  },
  Team: {
    async members(team, { where }, ctx) {
      const t = await Team.query().findById(team.id)
      return t.$relatedQuery('members')
    },
    object(team, vars, ctx) {
      const { objectId, objectType } = team
      return objectId && objectType ? { objectId, objectType } : null
    },
  },
  TeamMember: {
    async user(teamMember, vars, ctx) {
      const member = await TeamMember.query().findById(teamMember.id)
      return member ? member.$relatedQuery('user') : null
    },
    async alias(teamMember, vars, ctx) {
      const member = await TeamMember.query().findById(teamMember.id)
      return member ? member.$relatedQuery('alias') : null
    },
  },
}

const typeDefs = `
  extend type Query {
    team(id: ID): Team
    teams(where: TeamWhereInput): [Team]
  }

  extend type Mutation {
    createTeam(input: TeamInput): Team
    deleteTeam(id: ID): Team
    updateTeam(id: ID, input: TeamInput): Team
    updateTeamMember(id: ID!, input: String): TeamMember
  }

  extend type User {
    teams: [Team]
  }

  type Team {
    id: ID!
    type: String!
    role: String!
    name: String
    object: TeamObject
    objectId: ID
    objectType: String
    members: [TeamMember!]
    owners: [User]
    global: Boolean
  }

  input TeamMemberInput {
    id: ID
    user: TeamMemberUserInput
    alias: AliasInput
    status: String
    isShared: Boolean
  }

  input TeamMemberUserInput {
    id: ID!
  }

  type TeamMember {
    id: ID
    user: User
    status: String
    alias: Alias
    isShared: Boolean
  }

  type Alias {
    name: String
    email: String
    aff: String
  }

  input AliasInput {
    name: String
    email: String
    aff: String
  }

  type TeamObject {
    objectId: ID!
    objectType: String!
  }

  input TeamInput {
    role: String
    name: String
    objectId: ID
    objectType: String
    members: [TeamMemberInput]
    global: Boolean
  }

  input TeamWhereInput {
    role: String
    name: String
    objectId: ID
    objectType: String
    members: [TeamMemberInput]
    global: Boolean
    users: [ID!]
    alias: AliasInput
  }

`

module.exports = { resolvers, typeDefs }
