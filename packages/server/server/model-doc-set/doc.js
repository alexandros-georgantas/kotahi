const { BaseModel } = require('@coko/server')

class Doc extends BaseModel {
  static get tableName() {
    return 'docs'
  }

  static get relationMappings() {
    /* eslint-disable-next-line global-require */
    const { DocSet } = require('./docSet')
    /* eslint-disable-next-line global-require */
    const { DocRelation } = require('./docRelation')
    /* eslint-disable-next-line global-require */
    const { DocVersion } = require('./docVersion')
    return {
      docSet: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DocSet,
        join: {
          from: 'docs.docSetId',
          to: 'doc_sets.id',
        },
      },
      fromRelations: {
        relation: BaseModel.HasManyRelation,
        modelClass: DocRelation,
        join: {
          from: 'docs.id',
          to: 'doc_relations.toId', // The other doc in the relation is the 'from'
        },
      },
      toRelations: {
        relation: BaseModel.HasManyRelation,
        modelClass: DocRelation,
        join: {
          from: 'docs.id',
          to: 'doc_relations.fromId', // The other doc in the relation is the 'to'
        },
      },
      versions: {
        relation: BaseModel.HasManyRelation,
        modelClass: DocVersion,
        join: {
          from: 'docs.id',
          to: 'doc_versions.docId',
        },
        modify: builder =>
          builder
            .where('doc_versions.isDraft', false)
            .orderByRaw('doc_versions.lockedDate IS NULL') // Non-null lockedDates come first
            .orderBy('doc_versions.lockedDate')
            .orderBy('doc_versions.updated'), // For paranoia: we should only have one unlocked, non-draft version
      },
      currentVersion: {
        relation: BaseModel.HasOneRelation,
        modelClass: DocVersion,
        join: {
          from: 'docs.id',
          to: 'doc_versions.docId',
        },
        modify: builder =>
          builder
            .where('doc_versions.isDraft', false)
            .whereNull('doc_versions.lockedDate')
            .orderBy('doc_versions.updated', 'desc'), // For paranoia: we should only have one unlocked, non-draft version
      },
      oldVersions: {
        relation: BaseModel.HasManyRelation,
        modelClass: DocVersion,
        join: {
          from: 'docs.id',
          to: 'doc_versions.docId',
        },
        modify: builder =>
          builder
            .where('doc_versions.isDraft', false)
            .whereNotNull('doc_versions.lockedDate')
            .orderBy('doc_versions.lockedDate'),
      },
    }
  }

  async draftVersionForUser(userId) {
    /* eslint-disable-next-line global-require */
    const { DocVersion } = require('./docVersion')

    return DocVersion.query().findOne({
      isDraft: true,
      creatorId: userId,
      docId: this.id,
    })
  }

  static get schema() {
    return {
      properties: {
        docSetId: { type: 'string', format: 'uuid' },
        docType: { type: 'string' },
        modifiedDate: { type: ['string', 'object'], format: 'date-time' },
      },
    }
  }
}

module.exports = Doc
