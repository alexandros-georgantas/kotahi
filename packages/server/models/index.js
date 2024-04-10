const alias = require('./alias')
const articleImportHistory = require('./articleImportHistory')
const articleImportSources = require('./articleImportSources')
const articleTemplate = require('./articleTemplate')
const blacklistEmail = require('./blacklistEmail')
const channel = require('./channel')
const channelMember = require('./channelMember')
const cmsLayout = require('./cmsLayout')
const cmsPage = require('./cmsPage')
const coarNotification = require('./coarNotification')
const config = require('./config')
const docmap = require('./docmap')
const emailTemplate = require('./emailTemplate')
const file = require('./file')
const form = require('./form')
const group = require('./group')
const identity = require('./identity')
const invitation = require('./invitation')
const manuscript = require('./manuscript')
const message = require('./message')
const notificationDigest = require('./notificationDigest')
const notificationUserOption = require('./notificationUserOption')
const publishedArtifact = require('./publishedArtifact')
const review = require('./review')
const task = require('./task')
const taskAlert = require('./taskAlert')
const taskEmailNotification = require('./taskEmailNotification')
const taskEmailNotificationLog = require('./taskEmailNotificationLog')
const team = require('./team')
const teamMember = require('./teamMember')
const threadedDiscussion = require('./threadedDiscussion')
const user = require('./user')

// For use by config/components.js
const models = [
  alias,
  articleImportHistory,
  articleImportSources,
  articleTemplate,
  blacklistEmail,
  channel,
  channelMember,
  cmsLayout,
  cmsPage,
  coarNotification,
  config,
  docmap,
  emailTemplate,
  file,
  form,
  group,
  identity,
  invitation,
  manuscript,
  message,
  notificationDigest,
  notificationUserOption,
  publishedArtifact,
  review,
  task,
  taskAlert,
  taskEmailNotification,
  taskEmailNotificationLog,
  team,
  teamMember,
  threadedDiscussion,
  user,
]

module.exports = {
  models,
}
