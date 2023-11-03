/* eslint-disable no-await-in-loop */
const fs = require('fs-extra')
const crypto = require('crypto')
const multer = require('multer')
const passport = require('passport')
const path = require('path')
const { createFile } = require('@coko/server')
const { getFilesWithUrl } = require('../utils/fileStorageUtils')

const authBearer = passport.authenticate('bearer', { session: false })

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
      if (err) {
        cb(err)
        return
      }

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10000000, files: 10 },
})

module.exports = app => {
  // eslint-disable-next-line global-require
  const ArticleTemplate = require('../model-article-templates/src/articleTemplate')
  app.post(
    '/api/uploadAsset',
    authBearer,
    upload.array('files'),
    async (req, res, next) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < req.files.length; i++) {
        await createFile(
          fs.createReadStream(`${req.files[i].path}`),
          req.files[i].originalname,
          null,
          null,
          ['templateGroupAsset'],
          req.body.groupTemplateId,
        )
      }

      return res.send(
        await getFilesWithUrl(
          await ArticleTemplate.relatedQuery('files').for(
            req.body.groupTemplateId,
          ),
        ),
      )
    },
  )
}
