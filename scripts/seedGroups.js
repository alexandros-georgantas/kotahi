/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const { difference, map } = require('lodash')
const path = require('path')
const fs = require('fs-extra').promises

const {
  Channel,
  Group,
  Team,
  EmailTemplate,
  ArticleTemplate,
} = require('@pubsweet/models')

const seedConfig = require('./seedConfig')
const seedForms = require('./seedForms')
const defaultEmailTemplates = require('../config/defaultEmailTemplates')
const { generateCss } = require('../server/pdfexport/applyTemplate')

const defaultTemplatePath = path.resolve(
  __dirname,
  '../server/pdfexport/pdfTemplates',
)

const userTemplatePath = path.resolve(__dirname, '../config/journal/export')

const createGroupAndRelatedData = async (groupName, instanceName, index) => {
  const groupExists = await Group.query().findOne({ name: groupName })

  let group = null

  if (groupExists && groupExists.isArchived) {
    // Unarchive group that are added back to INSTANCE_GROUPS
    group = await Group.query().patchAndFetchById(groupExists.id, {
      isArchived: false,
    })

    console.log(
      `  Group "${groupName}" already exists in database and has been unarchived.`,
    )
  } else if (groupExists) {
    group = groupExists
    console.log(`  Group "${groupName}" already exists in database. Skipping.`)
  } else {
    // Seed group when a new entry is added to INSTANCE_GROUPS
    group = await Group.query().insertAndFetch({
      name: groupName,
      isArchived: false,
      type: 'Group',
    })

    console.log(`  Added "${group.name}" group to database.`)
  }

  // Seed config and link it to the created group
  const config = await seedConfig(group, instanceName, index)

  // Seed forms and link it to the created group
  await seedForms(group, config)

  // Seed System-wide discussion channel and link it to the created group
  const channelExists = await Channel.query().findOne({
    topic: 'System-wide discussion',
    type: 'editorial',
    groupId: group.id,
  })

  if (!channelExists) {
    const channel = await Channel.query().insertAndFetch({
      topic: 'System-wide discussion',
      type: 'editorial',
      groupId: group.id,
    })

    console.log(`    Added ${channel.topic} for "${group.name}".`)
  } else {
    console.log(
      `    ${channelExists.topic} already exists in database for "${group.name}". Skipping.`,
    )
  }

  // Seed user role and link it to the created group
  const userTeamExists = await Team.query().findOne({
    role: 'user',
    global: false,
    objectId: group.id,
    objectType: 'Group',
  })

  if (!userTeamExists) {
    const userTeam = await Team.query().insertAndFetch({
      name: 'User',
      role: 'user',
      global: false,
      objectId: group.id,
      objectType: 'Group',
    })

    console.log(`    Added ${userTeam.name} team for "${group.name}".`)
  } else {
    console.log(
      `    ${userTeamExists.name} team already exists in database for "${group.name}". Skipping.`,
    )
  }

  // Seed groupManager role and link it to the created group
  const groupManagerTeamExists = await Team.query().findOne({
    role: 'groupManager',
    global: false,
    objectId: group.id,
    objectType: 'Group',
  })

  if (!groupManagerTeamExists) {
    const groupManagerTeam = await Team.query().insertAndFetch({
      name: 'Group Manager',
      role: 'groupManager',
      global: false,
      objectId: group.id,
      objectType: 'Group',
    })

    console.log(`    Added ${groupManagerTeam.name} team for "${group.name}".`)
  } else {
    console.log(
      `    ${groupManagerTeamExists.name} team already exists in database for "${group.name}". Skipping.`,
    )
  }

  // Seed Group Templates and link it to the created group
  const existingArticleTemplate = await ArticleTemplate.query().where({
    groupId: group.id,
    isCms: false,
  })

  if (existingArticleTemplate.length === 0) {
    const cssTemplate = await generateCss()
    let articleTemplate = ''

    try {
      const userTemplateBuffer = await fs.readFile(
        `${userTemplatePath}/article.njk`,
      )

      articleTemplate += userTemplateBuffer.toString()
    } catch {
      console.error('No user PagedJS stylesheet found')

      const defaultTemplateBuffer = await fs.readFile(
        `${defaultTemplatePath}/article.njk`,
      )

      articleTemplate += defaultTemplateBuffer
    }

    await ArticleTemplate.query().insertGraph({
      article: articleTemplate,
      css: cssTemplate,
      groupId: group.id,
      isCms: false,
    })

    console.log(`Added default group template for "${group.name}".`)
  } else {
    console.log(
      `    ${existingArticleTemplate.length} group templates already exists in database for "${group.name}". Skipping.`,
    )
  }

  // Seed Group Templates and link it to the created group for cms
  const existingCmsArticleTemplate = await ArticleTemplate.query().where({
    groupId: group.id,
    isCms: true,
  })

  if (existingCmsArticleTemplate.length === 0) {
    await ArticleTemplate.query().insertGraph({
      article: '',
      css: '',
      groupId: group.id,
      isCms: true,
    })
  }

  // Seed email templates and link it to the created group
  const existingEmailTemplates = await EmailTemplate.query().where({
    groupId: group.id,
  })

  if (existingEmailTemplates.length === 0) {
    const emailTemplatesData = defaultEmailTemplates.map(template => ({
      emailTemplateType: template.type,
      emailContent: {
        subject: template.subject,
        cc: template.cc,
        ccEditors: template.ccEditors,
        body: template.body,
        description: template.description,
      },
      groupId: group.id,
    }))

    // Insert default email templates into the database for group
    const insertedEmailTemplates = await EmailTemplate.query().insertGraph(
      emailTemplatesData,
    )

    console.log(
      `    Added ${insertedEmailTemplates.length} number of default email templates for "${group.name}".`,
    )
  } else {
    console.log(
      `    ${existingEmailTemplates.length} email templates already exists in database for "${group.name}". Skipping.`,
    )
  }

  // TODO: below @mention notification addition can be moved to default templates and should be done via migration for clean code
  // Check if an email template for @mention notification already exists
  const existingEmailTemplateForMentionNotification = await EmailTemplate.query()
    .where({
      group_id: group.id,
      email_template_type: 'systemEmail',
    })
    .andWhereRaw("email_content->>'description' = '@mention notification'")

  if (existingEmailTemplateForMentionNotification.length === 0) {
    const emailTemplatesData = {
      emailTemplateType: 'systemEmail',
      emailContent: {
        description: '@mention notification',
        subject: `Kotahi | {{ currentUser }} has mentioned you in a discussion`,
        ccEditors: false,
        body: `<p>
        <p>Dear {{ recipientName }},</p>
        <p>{{ currentUser }} mentioned you in a discussion. Click here to reply; {{ discussionUrl }}</p>
        <p>Want to change your notification settings? Login to Kotahi and go to your profile page.</p>
        <p>Regards,<br>
        Kotahi team</p>`,
      },
      groupId: group.id,
    }

    await EmailTemplate.query().insertGraph(emailTemplatesData)

    console.log(
      `    Added @mention notification email template for "${group.name}".`,
    )
  } else {
    console.log(
      `    @mention Notification email template already exists in database for "${group.name}". Skipping.`,
    )
  }

  // update the 'emailTemplateType' value to 'taskNotification' for the task notification email template.
  try {
    await EmailTemplate.query()
      .patch({ emailTemplateType: 'taskNotification' })
      .where({ group_id: group.id })
      .andWhereRaw("email_content->>'subject' = 'Kotahi | Task notification'")

    console.log(
      `Updated email_template_type for the task notification email template.`,
    )
  } catch (error) {
    console.error(
      `Error updating email_template_type for the task notification email template.`,
      error,
    )
  }
}

const group = async () => {
  console.log(`INSTANCE_GROUPS: ${process.env.INSTANCE_GROUPS}`)

  const instanceGroups =
    process.env.INSTANCE_GROUPS &&
    process.env.INSTANCE_GROUPS.split(',')
      .map(g => g.trim())
      .filter(g => !!g)

  console.log(`Number of groups in .env ${instanceGroups.length}`)

  const instanceGroupNames = []

  await Promise.all(
    map(instanceGroups, async (instanceGroup, index) => {
      const splittedGroupVariables = instanceGroup && instanceGroup.split(':')
      const groupName = splittedGroupVariables[0]
      const instanceName = splittedGroupVariables[1]
      await createGroupAndRelatedData(groupName, instanceName, index)
      instanceGroupNames.push(groupName)
    }),
  ).then(async () => {
    let groups = await Group.query()

    const groupNames = groups.map(g => g.name)

    if (instanceGroups.length === groups.length) {
      console.log(`Number of groups in database ${groups.length}`)
    } else {
      // Archive groups that are removed from INSTANCE_GROUPS
      const archiveGroupNames = difference(groupNames, instanceGroupNames)

      const archiveGroupIds = groups
        .filter(g => archiveGroupNames.includes(g.name))
        .map(g => g.id)

      await Group.query().findByIds(archiveGroupIds).patch({
        isArchived: true,
      })

      groups = await Group.query()
      console.log(
        `  Archived groups: "${
          archiveGroupNames.length > 1
            ? archiveGroupNames.join(', ')
            : archiveGroupNames
        }"`,
      )
      console.log(`Number of groups in database ${groups.length}`)
    }
  })
}

module.exports = group
