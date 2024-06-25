const { cachedGet } = require('../../querycache')

const getReviewForm = async groupId =>
  cachedGet(`form:review:review:${groupId}`)

const getDecisionForm = async groupId =>
  cachedGet(`form:decision:decision:${groupId}`)

const getSubmissionForm = async groupId =>
  cachedGet(`form:submission:submit:${groupId}`)

module.exports = { getReviewForm, getDecisionForm, getSubmissionForm }
