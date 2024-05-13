// Strip 'submission.' out of field names.
// This is so we can pass just the submission object to the FormTemplate,
// not the whole manuscript object. This is to get different forms
// (submissions, decisions, reviews) operating more consistently, with
// a view to greater shared code.

/* eslint-disable no-param-reassign, no-restricted-syntax, no-await-in-loop, import/no-unresolved */
const { useTransaction } = require('@coko/server')

// Paths are relative to the generated migrations folder
/* eslint-disable-next-line import/extensions */
const Form = require('../server/model-form/src/form')

exports.up = async knex => {
  return useTransaction(async trx => {
    const forms = await Form.query(trx).where({ category: 'submission' })

    for (const form of forms) {
      for (const field of form.structure.children) {
        if (field.name === 'manuscriptFile') field.name = '$manuscriptFile'
        else if (field.name.startsWith('submission.'))
          [, field.name] = field.name.split('submission.')
      }

      await Form.query(trx).update(form).where({ id: form.id })
    }
  })
}
