const { GraphQLJSON } = require('graphql-type-json')

const typeDefs = `
  scalar JSON
`

const resolvers = {
  JSON: GraphQLJSON,
}

module.exports = { resolvers, typeDefs }
