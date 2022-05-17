const crypto = require('crypto')
const { promisify } = require('util')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const sharp = require('sharp')
const { fileStorage, createFile, deleteFiles } = require('@coko/server')
const { getFileWithUrl } = require('../../utils/fileStorageUtils')

const randomBytes = promisify(crypto.randomBytes)
const uploadsPath = config.get('pubsweet-server').uploads

/* eslint-disable no-unused-vars */
// direct file upload using fileStorage does not create a entry in database experiment code
const upload = async file => {
  const { createReadStream, filename } = await file
  const stream = createReadStream()

  const storedObjects = await fileStorage.upload(stream, filename)
  const originalFileUrl = await fileStorage.getURL(storedObjects[0].key)

  return originalFileUrl
}

// custom webp conversion experiment code
const createImageVersions = async (buffer, filename) => {
  try {
    const outputWebpPath = path.join(
      uploadsPath,
      `${filename.toString('hex')}.webp`,
    )

    await sharp(buffer).toFile(outputWebpPath)
    return {
      outputWebpPath,
    }
  } catch (e) {
    throw new Error(e)
  }
}

// create custom multiple version experiment code
const uploadFileWithMultipleVersions = async file => {
  const { createReadStream, filename, encoding } = await file
  const stream = createReadStream()
  const raw = await randomBytes(16)
  const generatedFilename = raw.toString('hex') + path.extname(filename)
  const outPath = path.join(uploadsPath, generatedFilename)

  await fs.ensureDir(uploadsPath)
  const outStream = fs.createWriteStream(outPath)
  stream.pipe(outStream, { encoding })

  const tempBuffs = []
  let buffer

  await new Promise((resolve, reject) => {
    stream.on('end', () => {
      buffer = Buffer.concat(tempBuffs)
      resolve()
    })
    stream.on('data', chunk => {
      tempBuffs.push(chunk)
    })
    stream.on('error', reject)
  })

  const localImageVersionPaths = await createImageVersions(buffer, raw)

  const { outputWebpPath } = localImageVersionPaths

  return { originalFilePath: outPath, webpFilePath: outputWebpPath }
}
/* eslint-enable no-unused-vars */

const resolvers = {
  Query: {},
  Mutation: {
    async uploadFile(_, { file }, ctx) {
      const { createReadStream, filename } = await file
      const fileStream = createReadStream()
      const storedObjects = await fileStorage.upload(fileStream, filename)
      storedObjects[0].url = await fileStorage.getURL(storedObjects[0].key)

      const data = {
        name: filename,
        storedObjects,
      }

      return data
    },
    async createFile(_, { file, meta }, ctx) {
      const { createReadStream, filename } = await file
      const fileStream = createReadStream()

      const createdFile = await createFile(
        fileStream,
        filename,
        null,
        null,
        [meta.fileType],
        meta.reviewCommentId || meta.manuscriptId,
      )

      const data = await getFileWithUrl(createdFile)

      return data
    },
    async deleteFile(_, { id }, ctx) {
      await deleteFiles([id], true)
      return id
    },
  },
}

module.exports = resolvers
