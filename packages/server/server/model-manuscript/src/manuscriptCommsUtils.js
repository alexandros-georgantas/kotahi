const models = require('@pubsweet/models')

/** For a given versionId, find the first/original version of that manuscript and return its ID */
const getIdOfFirstVersionOfManuscript = async (versionId, options = {}) =>
  (
    await models.Manuscript.query(options.trx)
      .select('parentId')
      .findById(versionId)
  ).parentId || versionId

/** For a given versionId, find the latest version of that manuscript and return its ID */
const getIdOfLatestVersionOfManuscript = async (versionId, options = {}) => {
  const { trx } = options

  const firstVersionId = await getIdOfFirstVersionOfManuscript(versionId, {
    trx,
  })

  return (
    await models.Manuscript.query(trx)
      .select('id')
      .where({ parentId: firstVersionId })
      .orWhere({ id: firstVersionId })
      .orderBy('created', 'desc')
      .limit(1)
  )[0].id
}

const isLatestVersionOfManuscript = async (versionId, options = {}) => {
  const { trx } = options

  const latestVersionId = await getIdOfLatestVersionOfManuscript(versionId, {
    trx,
  })

  return versionId === latestVersionId
}

const archiveOldManuscripts = async groupId => {
  const activeConfig = await models.Config.getCached(groupId)

  const { archivePeriodDays } = activeConfig.formData.manuscript
  if (Number.isNaN(archivePeriodDays) || archivePeriodDays < 1) return

  const cutoffDate = new Date(
    new Date().valueOf() - archivePeriodDays * 86400000, // subtracting milliseconds of ARCHIVE_PERIOD_DAYS
  )

  const archivedCount = await models.Manuscript.query()
    .update({ isHidden: true })
    .where('created', '<', cutoffDate)
    .where('status', 'new')
    .where('groupId', groupId)
    .whereNot('isHidden', true)
    .where(function subcondition() {
      this.whereRaw(`submission->>'$customStatus' = ''`).orWhereRaw(
        `submission->>'$customStatus' IS NULL`,
      )
    })

  // eslint-disable-next-line no-console
  console.info(
    `Automatically archived ${archivedCount} new, unlabelled manuscripts older than ${archivePeriodDays} days.`,
  )
}

/** Populates hasOverdueTasksForUser field of each manuscript IN PLACE.
 * A task is overdue for the current user if the user is an editor of the manuscript, or the task's assignee. */
const manuscriptHasOverdueTasksForUser = (manuscript, userId) => {
  const now = Date.now()

  const isEditor = manuscript.teams
    .filter(t => ['editor', 'handlingEditor', 'seniorEditor'].includes(t.role))
    .some(t => t.members.some(m => m.userId === userId))

  for (let i = 0; i < manuscript.tasks.length; i += 1) {
    const task = manuscript.tasks[i]

    if (
      (isEditor || task.assigneeUserId === userId) &&
      task.status === 'In progress' &&
      task.dueDate &&
      new Date(task.dueDate) < now
    ) {
      return true
    }
  }

  return false
}

/** Returns true if manuscript exists, is not archived, and is the most recent version */
const manuscriptIsActive = async (manuscriptId, options = {}) => {
  const { trx } = options

  const manuscript = await models.Manuscript.query(trx)
    .select('isHidden')
    .findById(manuscriptId)

  if (!manuscript) return false
  const { isHidden } = manuscript

  if (isHidden) return false

  const latestVersionId = await getIdOfLatestVersionOfManuscript(manuscriptId, {
    trx,
  })

  return manuscriptId === latestVersionId
}

/** Returns a list of user IDs for editors, handlingEditors and seniorEditors. */
const getEditorIdsForManuscript = async (manuscriptId, options = {}) => {
  const { trx } = options

  const teams = await models.Team.query(trx)
    .where({ objectId: manuscriptId })
    .whereIn('role', ['editor', 'handlingEditor', 'seniorEditor'])
    .withGraphFetched('members')

  return [...new Set(teams.map(t => t.members.map(m => m.userId)).flat())]
}

/** For all fields containing files, convert files expressed as simple IDs into full object form
 * with time-limited URL.
 * This modifies the supplied submission IN PLACE. */
/* eslint-disable no-restricted-syntax, no-await-in-loop, no-param-reassign */
const convertFilesToFullObjects = async (
  submission,
  form,
  /** Function to return full file objects from DB, for an array of file IDs */
  getFilesByIds,
  getFilesWithUrl,
) => {
  const fileFieldNames = form.structure.children
    .filter(field =>
      ['SupplementaryFiles', 'VisualAbstract'].includes(field.component),
    )
    .map(field => field.name)

  for (const [key, value] of Object.entries(submission)) {
    if (fileFieldNames.includes(key)) {
      const fileRecords = Array.isArray(value) ? value : []
      const fileIds = fileRecords.map(file => file.id || file) // Paranoia, in case some files are already in full object form
      const files = await getFilesByIds(fileIds)
      submission[key] = await getFilesWithUrl(files)
    }
  }
}
/* eslint-enable no-restricted-syntax, no-await-in-loop, no-param-reassign */

module.exports = {
  getIdOfFirstVersionOfManuscript,
  getIdOfLatestVersionOfManuscript,
  archiveOldManuscripts,
  manuscriptHasOverdueTasksForUser,
  manuscriptIsActive,
  getEditorIdsForManuscript,
  isLatestVersionOfManuscript,
  convertFilesToFullObjects,
}
