/**
 * For use by config/components.js
 */

const modelPaths = [
  'alias',
  'articleImportHistory',
  'articleImportSources',
  'articleTemplate',
  'blacklistEmail',
  'channel',
  'channelMember',
  'cmsLayout',
  'cmsPage',
  'coarNotification',
  'config',
  'docmap',
  'emailTemplate',
  'file',
  'form',
  'group',
  'identity',
  'invitation',
  'manuscript',
  'message',
  'notificationDigest',
  'notificationUserOption',
  'publishedArtifact',
  'review',
  'task',
  'taskAlert',
  'taskEmailNotification',
  'taskEmailNotificationLog',
  'team',
  'teamMember',
  'threadedDiscussion',
  'user',
].map(name => `./models/${name}`)

module.exports = modelPaths
