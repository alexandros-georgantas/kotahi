/* eslint-disable global-require */

module.exports = {
  ...require('./graphql'),
  modelName: 'DocSet',
  models: [
    { modelName: 'DocSet', model: require('./docSet') },
    { modelName: 'Doc', model: require('./doc') },
    { modelName: 'DocRelation', model: require('./docRelation') },
    { modelName: 'DocVersion', model: require('./docVersion') },
  ],
}
