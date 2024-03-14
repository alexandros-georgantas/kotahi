const { BaseModel } = require('@coko/server')

class CMSLanguageList extends BaseModel {
  static get tableName() {
    return 'cms_languages'
  }

  $formatDatabaseJson(obj) {
    const withLangFormatted = {
      ...obj,
      languages: `{${obj.languages.map(lang => `"${lang}"`).join(',')}}`,
    }

    return super.$formatDatabaseJson(withLangFormatted)
  }

  static get schema() {
    return {
      type: 'object',
      required: ['groupId', 'languages'],
      properties: {
        groupId: { type: 'string', format: 'uuid' },
        languages: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    }
  }
}

module.exports = CMSLanguageList
