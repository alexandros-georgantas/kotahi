const { BaseModel } = require('@coko/server')
const bcrypt = require('bcrypt')
const pick = require('lodash/pick')
const config = require('config')
const { raw } = require('objection')

const BCRYPT_COST = config.util.getEnv('NODE_ENV') === 'test' ? 1 : 12

class User extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'user'
  }

  $formatJson(json) {
    const cleanedJson = super.$formatJson(json)
    delete cleanedJson.passwordHash
    return cleanedJson
  }

  static get tableName() {
    return 'users'
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const File = require('@coko/server/src/models/file/file.model')

    const Identity = require('../identity/identity.model')
    const Review = require('../review/review.model')
    /* eslint-enable global-require */

    return {
      identities: {
        relation: BaseModel.HasManyRelation,
        modelClass: Identity,
        join: {
          from: 'users.id',
          to: 'identities.userId',
        },
      },
      defaultIdentity: {
        relation: BaseModel.HasOneRelation,
        modelClass: Identity,
        join: {
          from: 'users.id',
          to: 'identities.userId',
        },
        filter: builder => {
          builder.where('isDefault', true)
        },
      },
      teams: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: require.resolve('../team/team.model'),
        join: {
          from: 'users.id',
          through: {
            modelClass: require.resolve('../teamMember/teamMember.model'),
            from: 'team_members.userId',
            to: 'team_members.teamId',
            extra: ['status'],
          },
          to: 'teams.id',
        },
      },
      reviews: {
        relation: BaseModel.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.userId',
        },
      },
      file: {
        relation: BaseModel.HasOneRelation,
        modelClass: File,
        join: {
          from: 'users.id',
          to: 'files.objectId',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        admin: { type: ['boolean', 'null'] },
        email: { type: ['string', 'null'], format: 'email' },
        username: { type: 'string' },
        passwordHash: { type: ['string', 'null'] },
        online: { type: ['boolean', 'null'] },
        passwordResetToken: { type: ['string', 'null'] },
        passwordResetTimestamp: {
          type: ['string', 'object', 'null'],
          format: 'date-time',
        },
        profilePicture: { type: ['string', 'null'] },
        lastOnline: {
          type: ['string', 'object', 'null'],
          format: 'date-time',
        },
        recentTab: { type: ['string', 'null'] },
        preferredLanguage: { type: ['string', 'null'] },
        eventNotificationsOptIn: { type: ['boolean', true] },
        chatExpanded: { type: 'boolean' },
        menuPinned: { type: 'boolean' },
      },
    }
  }

  // This gives a view of the teams and team member structure to reflect
  // the current roles the user is performing. E.g. if they are a member
  // of a reviewer team and have the status of 'accepted', they will
  // have a 'accepted:reviewer' role present in the returned object
  async currentRoles(object) {
    let teams

    if (object && object.objectId && object.objectType) {
      teams = await this.$relatedQuery('teams').where(object)
    } else {
      teams = await this.$relatedQuery('teams')
    }

    const roles = {}

    teams.forEach(t => {
      const role = `${t.status ? `${t.status}:` : ''}${t.role}`

      // If there's an existing role for this object, add to the list
      if (t.objectId && Array.isArray(roles[t.objectId])) {
        roles[t.objectId].push(role)
      } else if (t.objectId) {
        roles[t.objectId] = [role]
      }
    })
    return Object.keys(roles).map(id => ({ id, roles: roles[id] }))
  }

  async save() {
    if (this.password) {
      this.passwordHash = await User.hashPassword(this.password)
      delete this.password
    }

    return super.save()
  }

  async validPassword(password) {
    return password && this.passwordHash
      ? bcrypt.compare(password, this.passwordHash)
      : false
  }

  static hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_COST)
  }

  static findByEmail(email) {
    return this.findByField('email', email).then(users => users[0])
  }

  static findByUsername(username) {
    return this.findByField('username', username).then(users => users[0])
  }

  static async findOneWithIdentity(userId, identityType) {
    // eslint-disable-next-line global-require
    const Identity = require('../identity/identity.model')

    const user = (
      await this.query()
        .alias('u')
        .leftJoin(
          Identity.query().where('type', identityType).as('i'),
          'u.id',
          'i.userId',
        )
        .where('u.id', userId)
    )[0]

    return user
  }

  static get modifiers() {
    return {
      orderByUsername(builder) {
        builder.orderBy(raw('LOWER(username)'), 'ASC')
      },
    }
  }

  // For API display/JSON purposes only
  static ownersWithUsername(object) {
    return Promise.all(
      object.owners.map(async ownerId => {
        const owner = await this.find(ownerId)
        return pick(owner, ['id', 'username'])
      }),
    )
  }
}

User.type = 'user'

module.exports = User
