const { BaseModel } = require('@coko/server')

class DocVersion extends BaseModel {
  static get tableName() {
    return 'doc_versions'
  }

  static get relationMappings() {
    /* eslint-disable-next-line global-require */
    const { Doc } = require('./doc')
    return {
      doc: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Doc,
        join: {
          from: 'doc_versions.docId',
          to: 'docs.id',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        docId: { type: 'string', format: 'uuid' },
        creatorId: { type: ['string', 'null'], format: 'uuid' },
        editorUserIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        isDraft: { type: 'boolean' },
        lockedDate: { type: ['string', 'object', 'null'], format: 'date-time' },
        data: {},
      },
    }
  }
}

module.exports = DocVersion
