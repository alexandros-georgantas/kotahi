/* eslint-disable import/no-unresolved */
const EmailTemplate = require('../models/emailTemplate/emailTemplate.model')
const Group = require('../models/group/group.model')

/* eslint-disable-next-line import/extensions */
const defaultEmailTemplates = require('../config/defaultEmailTemplates')
/* eslint-enable import/no-unresolved */

const TEMPLATE_TYPE = 'reviewSubmitted'

exports.up = async () => {
  const template = defaultEmailTemplates.find(t => t.type === TEMPLATE_TYPE)

  if (!template)
    throw new Error(
      `Type ${TEMPLATE_TYPE} not found in default email templates.`,
    )

  const groups = await Group.query()

  return Promise.all(
    groups.map(async group => {
      const existing = await EmailTemplate.query().where({
        groupId: group.id,
      })

      /**
       * If there are no existing templates, the seed scripts will take care of
       * adding the default templates, including this one
       */
      if (existing.totalCount === 0) return

      await EmailTemplate.query().insert({
        emailContent: {
          body: template.body,
          ccEditors: true,
          description: template.description,
          subject: template.subject,
        },
        emailTemplateType: template.type,
        groupId: group.id,
      })
    }),
  )
}
