const models = require('@pubsweet/models')
const { getFilesWithUrl } = require('../../utils/fileStorageUtils')
const { deepMergeObjectsReplacingArrays } = require('../../utils/objectUtils')
const { getReviewForm, getDecisionForm } = require('./reviewCommsUtils')
const { cachedGet } = require('../../querycache')

const {
  convertFilesToIdsOnly,
  convertFilesToFullObjects,
} = require('./reviewUtils')

const calculateShouldNotSetUser = async (ctx, manuscriptId) => {
  const activeConfig = await models.Config.getCached(
    ctx.req.headers['group-id'],
  )

  const { instanceName } = activeConfig?.formData

  if (instanceName !== 'prc' && instanceName !== 'journal') {
    return false
  }

  const user = await models.User.query().findById(ctx.user)

  const reviewerQuery = await user
    .$relatedQuery('teams')
    .where({ role: 'reviewer' })
    .andWhere({ objectId: manuscriptId, objectType: 'manuscript' })

  const isReviewer = reviewerQuery.length > 0

  if (isReviewer) {
    return false
  }

  const isEditorOfManuscript = await cachedGet(
    `userIsEditor:${ctx.user}:${manuscriptId}`,
  )

  const isGM = await cachedGet(
    `userIsGM:${ctx.user}:${ctx.req.headers['group-id']}`,
  )

  const isAdmin = await cachedGet(`userIsAdmin:${ctx.user}`)

  return isAdmin || isGM || isEditorOfManuscript
}

const resolvers = {
  Mutation: {
    async updateReview(_, { id, input }, ctx) {
      const reviewDelta = { jsonData: {}, ...input }
      const existingReview = (await models.Review.query().findById(id)) || {}

      const manuscript = await models.Manuscript.query().findById(
        existingReview.manuscriptId || input.manuscriptId,
      )

      const shouldNotSetUser = await calculateShouldNotSetUser(
        ctx,
        existingReview.manuscriptId || input.manuscriptId,
      )

      const form = existingReview.isDecision
        ? await getDecisionForm(manuscript.groupId)
        : await getReviewForm(manuscript.groupId)

      await convertFilesToIdsOnly(reviewDelta, form)

      const mergedReview = {
        canBePublishedPublicly: false,
        isHiddenFromAuthor: false,
        isHiddenReviewerName: false,
        ...deepMergeObjectsReplacingArrays(existingReview, reviewDelta),
        // Prevent reassignment of userId or manuscriptId:
        userId: existingReview.userId || (shouldNotSetUser ? null : ctx.user),
        manuscriptId: existingReview.manuscriptId || input.manuscriptId,
      }

      // Prevent reassignment of isDecision
      if (typeof existingReview.isDecision === 'boolean')
        mergedReview.isDecision = existingReview.isDecision

      // Ensure the following aren't null or undefined
      mergedReview.canBePublishedPublicly =
        !!mergedReview.canBePublishedPublicly
      mergedReview.isHiddenFromAuthor = !!mergedReview.isHiddenFromAuthor
      mergedReview.isHiddenReviewerName = !!mergedReview.isHiddenReviewerName

      const review = await models.Review.query().upsertGraphAndFetch(
        {
          id,
          ...mergedReview,
          jsonData: JSON.stringify(mergedReview.jsonData),
        },
        { insertMissing: true },
      )

      // We want to modify file URIs before return, so we'll use the parsed jsonData
      review.jsonData = mergedReview.jsonData

      const reviewUser = await models.User.query().findById(review.userId)

      await convertFilesToFullObjects(
        review,
        form,
        async ids => models.File.query().findByIds(ids),
        getFilesWithUrl,
      )

      return {
        id: review.id,
        created: review.created,
        updated: review.updated,
        isDecision: review.isDecision,
        open: review.open,
        user: reviewUser,
        isHiddenFromAuthor: review.isHiddenFromAuthor,
        isHiddenReviewerName: review.isHiddenReviewerName,
        canBePublishedPublicly: review.canBePublishedPublicly,
        jsonData: JSON.stringify(review.jsonData),
        manuscriptId: review.manuscriptId,
      }
    },

    async updateReviewerTeamMemberStatus(_, { manuscriptId, status }, ctx) {
      const manuscript = await models.Manuscript.query()
        .findById(manuscriptId)
        .withGraphFetched('[submitter.defaultIdentity, channels.members]')

      const team = await manuscript
        .$relatedQuery('teams')
        .where('role', 'reviewer')
        .first()

      const member = await team
        .$relatedQuery('members')
        .where('userId', ctx.user)
        .first()

      member.status = status
      member.updated = new Date().toISOString()
      return member.save()
    },
  },
  Review: {
    async user(parent, { id }, ctx) {
      // TODO redact user if it's an anonymous review and ctx.user is not editor or admin
      if (parent.user) {
        return parent.user
      }

      if (parent.userId) {
        return models.User.query().findById(parent.userId)
      }

      return null
    },
    async isSharedWithCurrentUser(parent, _, ctx) {
      if (
        parent.isSharedWithCurrentUser ||
        parent.isSharedWithCurrentUser === false
      )
        return !!parent.isSharedWithCurrentUser

      const sharedMembers = await models.Team.relatedQuery('members')
        .for(
          models.Team.query().where({
            role: 'reviewer',
            objectId: parent.manuscriptId,
          }),
        )
        .where({ isShared: true })
        .where(builder =>
          builder.where({ status: 'completed' }).orWhere({ userId: ctx.user }),
        )

      if (sharedMembers.some(m => m.userId === ctx.user)) return true
      return false
    },
  },
}

const typeDefs = `
  extend type Mutation {
    updateReview(id: ID, input: ReviewInput): Review!
    updateReviewerTeamMemberStatus(manuscriptId: ID!, status: String): TeamMember
  }

  type Review {
    id: ID!
    created: DateTime!
    updated: DateTime
    isDecision: Boolean
    open: Boolean
    user: User
    isHiddenFromAuthor: Boolean
    isHiddenReviewerName: Boolean
    isSharedWithCurrentUser: Boolean!
    canBePublishedPublicly: Boolean!
    jsonData: String
    userId: String
    files: [File]
  }

  input ReviewInput {
    isDecision: Boolean
    manuscriptId: ID!
    isHiddenFromAuthor: Boolean
    isHiddenReviewerName: Boolean
    canBePublishedPublicly: Boolean
    jsonData: String
    userId: String
  }
`

module.exports = { resolvers, typeDefs }
