const he = require('he')
const ArticleImportSources = require('../model-article-import-sources/src/articleImportSources')
const ArticleImportHistory = require('../model-article-import-history/src/articleImportHistory')
const { getSubmissionForms } = require('../model-review/src/reviewCommsUtils')

const getServerId = async serverLabel => {
  let [server] = await ArticleImportSources.query().where({
    server: serverLabel,
  })

  if (server) return server.id
  await ArticleImportSources.query().insert({ server: serverLabel })
  ;[server] = await ArticleImportSources.query().where({
    server: serverLabel,
  })
  return server.id
}

/** Return the last import date for this server, or if no imports have been done, return start of epoch */
const getLastImportDate = async (serverId, groupId) => {
  const results = await ArticleImportHistory.query()
    .select('date')
    .where({ sourceId: serverId, groupId })

  if (results.length) return results[0].date
  return 0
}

const getEmptySubmission = async groupId => {
  const submissionForms = await getSubmissionForms(groupId)

  const submissionForm =
    submissionForms.find(f => f.isDefault) ?? submissionForms[0]

  const fieldNamesFound = new Set()
  const allFields = []
  submissionForm.structure.children.forEach(field => {
    if (!field.name.startsWith('submission.')) return
    if (fieldNamesFound.has(field.name)) return
    fieldNamesFound.add(field.name)
    allFields.push(field)
  })

  const emptySubmission = allFields.reduce((acc, curr) => {
    const [, nameInSubmission] = curr.name.split('submission.')
    acc[nameInSubmission] = [
      'CheckboxGroup',
      'LinksInput',
      'AuthorsInput',
    ].includes(curr.component)
      ? []
      : ''
    return {
      ...acc,
    }
  }, {})

  emptySubmission.$$formPurpose = submissionForm.structure.purpose

  return emptySubmission
}

const getDate2WeeksAgo = () =>
  +new Date(new Date(Date.now()).toISOString().split('T')[0]) - 12096e5

/** Converts an abstract retrieved from bioRxiv or medRxiv to safe HTML. */
const rawAbstractToSafeHtml = raw => {
  if (!raw) return null
  // TODO replace substrings such as '{beta}', '{gamma}' with unicode characters. I don't know if they all use HTML entity names
  const encoded = he.encode(raw)
  return `<p>${encoded.replace(/\n\s*/g, '</p>\n<p>')}</p>`
}

module.exports = {
  getServerId,
  getLastImportDate,
  getEmptySubmission,
  getDate2WeeksAgo,
  rawAbstractToSafeHtml,
}
