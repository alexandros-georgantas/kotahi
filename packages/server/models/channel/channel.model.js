const { BaseModel } = require('@coko/server')

class Channel extends BaseModel {
  static get tableName() {
    return 'channels'
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const Team = require('../team/team.model')
    const ChannelMember = require('../channelMember/channelMember.model')
    const User = require('../user/user.model')
    const Manuscript = require('../manuscript/manuscript.model')
    const Message = require('../message/message.model')
    const Group = require('../group/group.model')
    /* eslint-emable global-require */

    return {
      messages: {
        relation: BaseModel.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'channels.id',
          to: 'messages.channelId',
        },
      },
      members: {
        relation: BaseModel.HasManyRelation,
        modelClass: ChannelMember,
        join: {
          from: 'channels.id',
          to: 'channel_members.channelId',
        },
      },
      team: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: 'channels.teamId',
          to: 'teams.id',
        },
      },
      manuscript: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Manuscript,
        join: {
          from: 'channels.manuscriptId',
          to: 'manuscripts.id',
        },
      },
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'channels.id',
          through: {
            modelClass: require.resolve('../channelMember/channelMember.model'),
            from: 'channel_members.channelId',
            to: 'channel_members.userId',
          },
          to: 'users.id',
        },
      },
      group: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Group,
        join: {
          from: 'channels.groupId',
          to: 'groups.id',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        type: { type: ['string', 'null'] },
        topic: { type: 'string' },
        teamId: { type: ['string', 'null'], format: 'uuid' },
        manuscriptId: { type: ['string', 'null'], format: 'uuid' },
        groupId: { type: ['string', 'null'], format: 'uuid' },
      },
    }
  }
}

module.exports = Channel
