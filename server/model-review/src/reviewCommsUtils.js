const models = require('@pubsweet/models')

const getForm = async criteria => {
  const form = await models.Form.query().findOne(criteria)
  if (!form) throw new Error(`No form found for "${JSON.stringify(criteria)}"`)
  return form
}

const getReviewForm = async groupId =>
  getForm({ category: 'review', isActive: true, groupId })

const getDecisionForm = async groupId =>
  getForm({ category: 'decision', isActive: true, groupId })

const getSubmissionForms = async groupId =>
  models.Form.query().where({ category: 'submission', isActive: true, groupId })

const getSubmissionFormForPurpose = async (purpose, groupId) =>
  models.Form.query()
    .findOne({ category: 'submission', isActive: true, groupId })
    .whereRaw("structure->>'purpose' = ?", purpose)

module.exports = {
  getReviewForm,
  getDecisionForm,
  getSubmissionForms,
  getSubmissionFormForPurpose,
}
