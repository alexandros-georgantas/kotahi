const Form = require('../../../models/form/form.model')

const {
  evictFromCacheByPrefix,
  evictFromCache,
  cachedGet,
} = require('../../querycache')

const resolvers = {
  Mutation: {
    deleteForm: async (_, { formId }) => {
      await Form.query().deleteById(formId)
      evictFromCacheByPrefix('form:')
      return { query: {} }
    },
    deleteFormElement: async (_, { formId, elementId }) => {
      const form = await Form.find(formId)

      if (!form) return null
      form.structure.children = form.structure.children.filter(
        child => child.id !== elementId,
      )

      const formRes = await Form.query().patchAndFetchById(formId, {
        structure: form.structure,
      })

      evictFromCache(`form:${form.category}:${form.purpose}:${form.groupId}`)

      return formRes
    },
    createForm: async (_, { form }) => {
      return Form.query().insertAndFetch(form)
    },
    updateForm: async (_, { form }) => {
      const result = await Form.query().patchAndFetchById(form.id, form)
      if (!result) throw new Error('Attempt to update non-existent form')

      const purposeIndicatingActiveForm =
        result.category === 'submission' ? 'submit' : result.category

      const thisFormIsActive = result.purpose === purposeIndicatingActiveForm

      if (thisFormIsActive) {
        // Ensure all other forms in this category are inactive
        await Form.query()
          .patch({ purpose: 'other' })
          .whereNot({ purpose: 'other' })
          .where({ category: result.category, groupId: result.groupId })
          .whereNot({ id: result.id })
      }

      evictFromCache(
        `form:${result.category}:${result.purpose}:${result.groupId}`,
      )

      return result
    },
    updateFormElement: async (_, { element, formId }) => {
      const form = await Form.find(formId)
      if (!form) return null

      const indexToReplace = form.structure.children.findIndex(
        field => field.id === element.id,
      )

      if (indexToReplace < 0) form.structure.children.push(element)
      else form.structure.children[indexToReplace] = element

      const result = await Form.query().patchAndFetchById(formId, {
        structure: form.structure,
      })

      evictFromCache(
        `form:${result.category}:${result.purpose}:${result.groupId}`,
      )

      return result
    },
  },
  Query: {
    form: async (_, { formId }) => Form.find(formId),
    forms: async () => Form.all(),
    formsByCategory: async (_, { category, groupId }) =>
      Form.query().where({
        category,
        groupId,
      }),

    /** Returns the specific requested form */
    formForPurposeAndCategory: async (_, { purpose, category, groupId }) =>
      cachedGet(`form:${category}:${purpose}:${groupId}`),
  },
}

module.exports = resolvers
