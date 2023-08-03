const models = require('@pubsweet/models')
const { ref } = require('objection')

const getActiveForms = async () => {
  const forms = await models.Form.query()
    .where({ category: 'submission', purpose: 'submit' })
    .orWhere({ category: 'review', purpose: 'review' })
    .orWhere({ category: 'decision', purpose: 'decision' })

  return {
    submissionForm: forms.find(f => f.purpose === 'submit'),
    reviewForm: forms.find(f => f.purpose === 'review'),
    decisionForm: forms.find(f => f.purpose === 'decision'),
  }
}

/** Change field name in form, and in all form-data for all manuscripts.
 * Avoid creating duplicate field names (though this is not guaranteed for
 * old manuscripts that contain different fields to the current form).
 */
const migrateFieldName = async (formId, oldFieldName, newFieldName) => {
  const form = await models.Form.query().findById(formId)
  if (!form)
    throw new Error(
      `Cannot change field name in form ${formId}: the form was not found`,
    )

  const field = form.structure.children.some(f => f.name === oldFieldName)
  if (!field)
    throw new Error(
      `Cannot change field name in form ${formId}: field '${oldFieldName}' was not found`,
    )

  if (oldFieldName === newFieldName) return // Nothing to do

  if (form.structure.children.some(f => f.name === newFieldName))
    throw new Error(
      `Cannot change field name in form ${formId}: a field named '${newFieldName}' already exists`,
    )

  const nameValidationRegex =
    form.purpose === 'submit'
      ? /^(?:submission\.[a-zA-Z]\w*|meta.title|meta.abstract|fileName|visualAbstract|manuscriptFile)$/
      : /^[a-zA-Z]\w*$/

  if (
    !nameValidationRegex.test(oldFieldName) ||
    !nameValidationRegex.test(newFieldName)
  )
    throw new Error(
      `Cannot change field name in form ${formId} from '${oldFieldName}' to '${newFieldName}': illegal name`,
    )

  if (form.purpose === 'submit') {
    const pgOldField = oldFieldName.replace('.', ':')
    const pgNewField = newFieldName.replace('.', ':')

    await models.Manuscript.query().patch({
      [pgNewField]: ref(pgOldField),
      [pgOldField]: null,
    })
  } else if (form.purpose === 'review') {
    await models.Review.query()
      .patch({
        [newFieldName]: ref(oldFieldName),
        [oldFieldName]: null,
      })
      .whereNot({ isDecision: true })
  } else {
    // form.purpose === 'decision'
    await models.Review.query()
      .patch({
        [newFieldName]: ref(oldFieldName),
        [oldFieldName]: null,
      })
      .where({ isDecision: true })
  }
}

module.exports = { getActiveForms, migrateFieldName }
