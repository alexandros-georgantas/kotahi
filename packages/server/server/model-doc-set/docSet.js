const { BaseModel } = require('@coko/server')

class DocSet extends BaseModel {
  static get tableName() {
    return 'doc_sets'
  }

  static get relationMappings() {
    /* eslint-disable-next-line global-require */
    const { Doc } = require('./doc')
    /* eslint-disable-next-line global-require */
    const { DocRelation } = require('./docRelation')
    return {
      docs: {
        relation: BaseModel.HasManyRelation,
        modelClass: Doc,
        join: {
          from: 'doc_sets.id',
          to: 'docs.docSetId',
        },
      },
      mainDoc: {
        relation: BaseModel.HasOneRelation,
        modelClass: Doc,
        join: {
          from: 'doc_sets.mainDocId',
          to: 'docs.id',
        },
      },
      relations: {
        relation: BaseModel.HasManyRelation,
        modelClass: DocRelation,
        join: {
          from: 'doc_sets.id',
          to: 'doc_relations.docSetId',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        groupId: { type: 'string', format: 'uuid' },
        mainDocId: { type: ['string', 'null'], format: 'uuid' },
        title: { type: 'string' },
        creatorId: { type: ['string', 'null'], format: 'uuid' },
        modifiedDate: { type: ['string', 'object'], format: 'date-time' },
      },
    }
  }
}

module.exports = DocSet
