/* eslint-disable no-unused-vars */

// const { execSync } = require('child_process')
const path = require('path')
const { readFileSync } = require('fs')

const { logger } = require('@coko/server')

const { resetDbAndApplyDump } = require('../../../scripts/resetDb')
const { applyDump } = require('../../../scripts/resetDb')
const createToken = require('../../../scripts/cypress/createToken')
const seedForms = require('../../../scripts/cypress/seedForms')

const dumpFile = name => path.join(__dirname, 'dumps', `${name}.sql`)

// const dump = name => {
//   if (process.env.NEWDUMPS) {
//     return execSync(`pg_dump --column-inserts -d simplej > ${dumpFile(name)}`)
//   }

//   return true
// }

const restore = async name => {
  // Migrations paths in components.json are relative to packages/server, but cypress runs
  // in the project root folder. So we must change folder while migrations are run.
  // const originalDirectory = process.cwd()

  // if (!originalDirectory.endsWith('/packages/server')) {
  //   const targetDirectory = './packages/server'
  //   process.chdir(targetDirectory)
  // }

  // let result = false

  // try {
  // const {
  //   resetDbAndApplyDump,
  // } = require('../../../scripts/resetDb') /* eslint-disable-line global-require */

  // result = await resetDbAndApplyDump(
  //   readFileSync(dumpFile(name), 'utf-8'),
  //   name,
  // )
  // }
  // finally {
  //   process.chdir(originalDirectory)
  // }

  // Wait long enough for server-side cache to clear
  /* eslint-disable-next-line no-promise-executor-return */
  // await new Promise(resolve => setTimeout(resolve, 10500))
  // return result

  return resetDbAndApplyDump(readFileSync(dumpFile(name), 'utf-8'), name)
}

const seed = async name => {
  // Restore without clear
  return applyDump(
    readFileSync(dumpFile(name), 'utf-8'),
    {
      truncate: false,
    },
    name,
  )
}

module.exports = app => {
  app.post('/api/e2e/restore/:name', async (req, res, next) => {
    const { name } = req.params

    /* eslint-disable-next-line no-console */
    console.log('BOOYA!')

    try {
      await restore(name)
      res.send(200)
    } catch (err) {
      logger.error(err)
      res.send(500)
    }
  })

  app.post('/api/e2e/seed/:name', async (req, res, next) => {
    const { name } = req.params

    try {
      await seed(name)
      res.send(200)
    } catch (err) {
      logger.error(err)
      res.send(500)
    }
  })

  app.post('/api/e2e/createToken/:username', async (req, res, next) => {
    const { username } = req.params

    try {
      await createToken(username)
      res.send(200)
    } catch (err) {
      logger.error(err)
      res.send(500)
    }
  })

  app.post('/api/e2e/seedForms', async (req, res, next) => {
    try {
      await seedForms()
      res.send(200)
    } catch (err) {
      logger.error(err)
      res.send(500)
    }
  })
}
