const { startServer } = require('@coko/server')
const yjsWebocket = require('./server/yjsWebsocket/yjsWebsocket')

const seedGroups = require('./scripts/seedGroups')

const main = async () => {
  await seedGroups()
  startServer()

  yjsWebocket()
}

main()
