// Store IDs of attached files (from attachment or visualAbstract fields)
// in the submission object. This requires updating:
// - forms: to give sensible names to these fields
// - manuscripts: to add file IDs into the submission field data
// - files: to change 'supplementary' and 'visualAbstract' tags to 'submission'

// Previously, info about attached files wasn't stored in submission data.
// You had to instead query the `files` of a manuscript and search for
// files with the 'supplementary' or 'visualAttachment' tags.
// A major downside of this was that only one attachments field and one
// visual abstract field could be included in a submission form without
// causing bugs, as there was no way to distinguish which specific
// attachments (or visualAbstract) field any file belonged to.
//
// Furthermore, reviews and decisions have stored file info in their form
// data for some time now. This change makes form functionality more
// consistent.

/* eslint-disable no-param-reassign, no-restricted-syntax, no-await-in-loop, import/no-unresolved */
const { useTransaction, File } = require('@coko/server')

// Paths are relative to the generated migrations folder
/* eslint-disable-next-line import/extensions */
const Form = require('../server/model-form/src/form')
/* eslint-disable-next-line import/extensions */
const Manuscript = require('../server/model-manuscript/src/manuscript')

/** Return the supplied basename, unless it collides with an existing
 * field name, in which case append a number that prevents collision.
 */
const getUniqueName = (baseName, form) => {
  const existingNames = form.structure.children.map(f => f.name)
  let name = baseName
  let i = 1

  while (existingNames.includes(name)) {
    i += 1
    name = `${baseName}${i}`
  }

  return name
}

const setFilesInSubmissions = async (trx, groupId, fieldName, fileTag) => {
  const manuscripts = await Manuscript.query(trx).where({ groupId })

  for (const manuscript of manuscripts) {
    const files = await File.query(trx).where({ objectId: manuscript.id })

    const filesForField = files.filter(f => f.tags.includes(fileTag))

    if (filesForField.length) {
      manuscript.submission[fieldName] = filesForField.map(f => f.id)
      await Manuscript.query(trx).patchAndFetchById(manuscript.id, {
        submission: manuscript.submission,
      })

      // change tag on files to 'submission'
      filesForField.forEach(file => {
        file.tags = file.tags.map(t => (t === fileTag ? 'submission' : t))
      })
      await File.query(trx).upsertGraph(filesForField)
    }
  }
}

exports.up = async knex => {
  return useTransaction(async trx => {
    const forms = await Form.query(trx).where({ category: 'submission' })

    for (const form of forms) {
      for (const field of form.structure.children) {
        if (field.component === 'SupplementaryFiles') {
          field.name = getUniqueName('submission.attachments', form)

          await setFilesInSubmissions(
            trx,
            form.groupId,
            field.name.split('submission.')[1],
            'supplementary',
          )
        }

        if (field.component === 'VisualAbstract') {
          field.name = getUniqueName('submission.visualAbstract', form)

          await setFilesInSubmissions(
            trx,
            form.groupId,
            field.name.split('submission.')[1],
            'visualAbstract',
          )
        }
      }

      await Form.query(trx).update(form).where({ id: form.id })
    }
  })
}
