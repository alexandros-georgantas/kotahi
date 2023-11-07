const models = require('@pubsweet/models')
const { ref } = require('objection')

/** Returns ALL active submission forms, a SINGLE active review form (if any), and a SINGLE active decision form (if any) */
const getActiveForms = async groupId => {
  const forms = await models.Form.query()
    .where({ category: 'submission', isActive: true, groupId })
    .orWhere({ category: 'review', isActive: true, groupId })
    .orWhere({ category: 'decision', isActive: true, groupId })

  return {
    submissionForms: forms.filter(f => f.category === 'submission'),
    reviewForm: forms.find(f => f.category === 'review'),
    decisionForm: forms.find(f => f.category === 'decision'),
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
    form.category === 'submission'
      ? /^(?:submission\.\$?[a-zA-Z]\w*|fileName|visualAbstract|manuscriptFile)$/
      : /^[a-zA-Z]\w*$/

  if (
    !nameValidationRegex.test(oldFieldName) ||
    !nameValidationRegex.test(newFieldName)
  )
    throw new Error(
      `Cannot change field name in form ${formId} from '${oldFieldName}' to '${newFieldName}': illegal name`,
    )

  const { groupId } = form

  if (form.category === 'submission') {
    const pgOldField = oldFieldName.replace('.', ':')
    const pgNewField = newFieldName.replace('.', ':')

    await models.Manuscript.query()
      .patch({
        [pgNewField]: ref(pgOldField),
        [pgOldField]: null,
      })
      .where({ groupId })
  } else if (form.category === 'review') {
    await models.Manuscript.relatedQuery('reviews')
      .for(models.Manuscript.query().where({ groupId }))
      .patch({
        [newFieldName]: ref(oldFieldName),
        [oldFieldName]: null,
      })
      .whereNot({ isDecision: true })
  } else {
    // form.category === 'decision'
    await models.Manuscript.relatedQuery('reviews')
      .for(models.Manuscript.query().where({ groupId }))
      .patch({
        [newFieldName]: ref(oldFieldName),
        [oldFieldName]: null,
      })
      .where({ isDecision: true })
  }
}

module.exports = { getActiveForms, migrateFieldName }
