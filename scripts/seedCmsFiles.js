const fs = require('fs')
const path = require('path')
const { useTransaction, createFile } = require('@coko/server')

const { CMSFileTemplate } = require('@pubsweet/models')

const {
  connectToFileStorage,
} = require('@coko/server/src/services/fileStorage')

const readDirectoryRecursively = async (directoryPath, parentId, callBack) => {
  const files = fs.readdirSync(directoryPath)

  files.forEach(async file => {
    const filePath = path.join(directoryPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      const insertedDirectoryId = await callBack(filePath, parentId, true)
      // It's a directory, so recursively read its contents
      await readDirectoryRecursively(filePath, insertedDirectoryId, callBack)
    } else {
      // It's a file, you can perform operations on the file here
      await callBack(filePath, parentId, false)
    }
  })
}

const seed = async group => {
  await connectToFileStorage()

  const insertResource = async (name, parentId, isDirectory) =>
    useTransaction(async trx => {
      const existingFileResource = await CMSFileTemplate.query(trx).where({
        groupId: group.id,
        name,
      })

      if (existingFileResource.length === 0) {
        const insertedResource = await CMSFileTemplate.query(trx)
          .insertGraph({
            name,
            parentId,
            groupId: group.id,
          })
          .returning('id')

        if (!isDirectory) {
          const insertedFile = await createFile(
            fs.createReadStream(name),
            name,
            null,
            null,
            ['cmsTemplateFile'],
            insertedResource.id,
            { trx },
          )

          await CMSFileTemplate.query(trx)
            .update({ fileId: insertedFile.id })
            .where({ id: insertedResource.id })
        }
      }

      return existingFileResource.id
    })

  const insertedFolderId = await insertResource(group.name, null, true)

  await readDirectoryRecursively(
    `${__dirname}/../config/cmsTemplateFiles`,
    insertedFolderId,
    insertResource,
  )
}

module.exports = seed
