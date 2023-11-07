const models = require('@pubsweet/models')

const { getSubmissionForms } = require('../model-review/src/reviewCommsUtils')

const { importWorkersByGroup } = require('./imports')
const { getEmptySubmission } = require('../import-articles/importTools')

const assertArgTypes = (args, ...typeSpecs) => {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    const typeSpec = typeSpecs[i]
    const types = Array.isArray(typeSpec) ? typeSpec : [typeSpec]

    if (!types.includes(typeof arg))
      throw new Error(
        `Illegal type of ${typeof arg} for param '${i}. Should be ${types.join(
          ' or ',
        )}.`,
      )
  }
}

const getBroker = (groupId, workerName) => {
  let importWorkers = importWorkersByGroup[groupId]

  if (!importWorkers) {
    importWorkers = []
    importWorkersByGroup[groupId] = importWorkers
  }

  return {
    addManuscriptImporter: (importType, doImport) => {
      assertArgTypes([importType, doImport], 'string', 'function')
      importWorkers.push({
        name: workerName,
        importType,
        doImport,
      })
    },
    findManuscriptWithDoi: async doi =>
      doi
        ? models.Manuscript.query()
            .where({ groupId })
            .whereRaw("submission->>'$doi' = ?", [doi])
            .first()
        : null,
    findManuscriptWithUri: async uri =>
      uri
        ? models.Manuscript.query()
            .where({ groupId })
            .whereRaw("submission->>'$sourceUri' = ?", [uri])
            .first()
        : null,
    getStubManuscriptObject: async () => ({
      status: 'new',
      isImported: false,
      submission: await getEmptySubmission(groupId),
      meta: { title: '' },
      channels: [
        {
          topic: 'Manuscript discussion',
          type: 'all',
        },
        {
          topic: 'Editorial discussion',
          type: 'editorial',
        },
      ],
      files: [],
      reviews: [],
      teams: [],
    }),
    getSubmissionForms: () => getSubmissionForms(groupId),
    groupId,
    logger: console, // TODO modify console to include group and plugin name identifier
  }
}

module.exports = { getBroker }
