const { BaseModel } = require('@coko/server')

const { AjvValidator } = require('objection')

const CLASSES = {
  Buffer,
}

class ArticleTemplate extends BaseModel {
  static get tableName() {
    return 'article_templates'
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: ajv => {
        ajv.addKeyword('instanceof', {
          compile: schema => data =>
            data instanceof CLASSES[schema] || data === null || data === '',
        })
      },
    })
  }

  constructor(properties) {
    super(properties)
    this.type = 'ArticleTemplate'
  }

  static get relationMappings() {
    /* eslint-disable-next-line global-require */
    const File = require('@coko/server/src/models/file/file.model')
    /* eslint-disable-next-line global-require */
    const Group = require('../../model-group/src/group')

    return {
      files: {
        relation: BaseModel.HasManyRelation,
        modelClass: File,
        join: {
          from: 'article_templates.id',
          to: 'files.objectId',
        },
      },
      group: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Group,
        join: {
          from: 'article_templates.groupId',
          to: 'groups.id',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        name: { type: ['string', 'null'] },
        article: { instanceof: 'Buffer' },
        css: { instanceof: 'Buffer' },
        groupId: { type: ['string', 'null'], format: 'uuid' },
      },
    }
  }
}

ArticleTemplate.type = 'ArticleTemplate'

module.exports = ArticleTemplate
