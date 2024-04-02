const { BaseModel } = require('@coko/server')

class DocRelation extends BaseModel {
  static get tableName() {
    return 'doc_relations'
  }

  static get relationMappings() {
    /* eslint-disable-next-line global-require */
    const { DocSet } = require('./docSet')
    /* eslint-disable-next-line global-require */
    const { Doc } = require('./doc')
    return {
      docSet: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DocSet,
        join: {
          from: 'doc_relations.docSetId',
          to: 'doc_sets.id',
        },
      },
      from: {
        relation: BaseModel.HasOneRelation,
        modelClass: Doc,
        join: {
          from: 'doc_relations.fromId',
          to: 'docs.id',
        },
      },
      to: {
        relation: BaseModel.HasOneRelation,
        modelClass: Doc,
        join: {
          from: 'doc_relations.toId',
          to: 'docs.id',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        docSetId: { type: 'string', format: 'uuid' },
        fromId: { type: 'string', format: 'uuid' },
        toId: { type: 'string', format: 'uuid' },
        relationType: { type: 'string' },
        context: {},
      },
    }
  }
}

module.exports = DocRelation
