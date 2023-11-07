const models = require('@pubsweet/models')

/** Ensure we don't have two active forms for the same category/purpose combination,
 * by deactivating other forms as necessary. If one of the deactivated forms was
 * the default form for the category, this form will now be promoted to default.
 */
const reorganiseActiveAndDefaultForms = async (
  form,
  wasActive,
  wasDefault,
  oldPurpose,
) => {
  let result = form

  if (form.isActive && (!wasActive || form.structure.purpose !== oldPurpose)) {
    const shouldMakeDefault = !!(
      await models.Form.query()
        .where({
          isDefault: true,
          category: form.category,
          groupId: form.groupId,
        })
        .whereRaw("structure->>'purpose' = ?", form.structure.purpose)
        .whereNot({ id: form.id })
    ).length

    if (shouldMakeDefault)
      result = await models.Form.query().patchAndFetchById(form.id, {
        isDefault: true,
      })

    await models.Form.query()
      .patch({ isActive: false, isDefault: false })
      .where({
        isActive: true,
        category: form.category,
        groupId: form.groupId,
      })
      .whereRaw("structure->>'purpose' = ?", form.structure.purpose)
      .whereNot({ id: form.id })
  }

  if (result.isDefault && !wasDefault) {
    await models.Form.query()
      .patch({ isDefault: false })
      .where({
        isDefault: true,
        category: form.category,
        groupId: form.groupId,
      })
      .whereNot({ id: form.id })
  }

  return result
}

const resolvers = {
  Mutation: {
    deleteForm: async (_, { formId }) => models.Form.query().deleteById(formId),
    deleteFormElement: async (_, { formId, elementId }) => {
      const form = await models.Form.find(formId)

      if (!form) return null
      form.structure.children = form.structure.children.filter(
        child => child.id !== elementId,
      )

      const result = await models.Form.query().patchAndFetchById(formId, {
        structure: form.structure,
      })

      return result
    },
    createForm: async (_, { form }) => {
      const result = await models.Form.query().insertAndFetch(form)
      return reorganiseActiveAndDefaultForms(result, false, false, null)
    },
    updateForm: async (_, { form }) => {
      const prior = await models.Form.query().findById(form.id)
      const result = await models.Form.query().patchAndFetchById(form.id, form)

      return reorganiseActiveAndDefaultForms(
        result,
        prior.isActive,
        prior.isDefault,
        prior.structure.purpose,
      )
    },
    updateFormElement: async (_, { element, formId }) => {
      const form = await models.Form.find(formId)
      if (!form) return null

      const indexToReplace = form.structure.children.findIndex(
        field => field.id === element.id,
      )

      if (indexToReplace < 0) form.structure.children.push(element)
      else form.structure.children[indexToReplace] = element

      return models.Form.query().patchAndFetchById(formId, {
        structure: form.structure,
      })
    },
  },
  Query: {
    form: async (_, { formId }) => models.Form.find(formId),
    /** Both active and inactive forms in this category, for the current group */
    allFormsInCategory: async (_, { category, groupId }) => {
      return models.Form.query().where({
        category,
        groupId,
      })
    },
    /** A single active form for this category, current group.
     *  Not for use with "submission" category, which allows multiple active forms */
    activeFormInCategory: async (_, { category, groupId }) => {
      if (category === 'submission')
        throw new Error(
          'Use activeFormsInCategory instead for "submission" category, as as there may be multiple active forms.',
        )

      const result = models.Form.query().findOne({
        category,
        groupId,
        isActive: true,
      })

      if (!result)
        throw new Error(
          `No active form found for category ${category}, groupId ${groupId}`,
        )
      return result
    },
    /** Returns active forms for this category, current group.
     * Currently intended for use with the "submission" category only, which can
     * have multiple active forms.
     */
    activeFormsInCategory: async (_, { category, groupId }) => {
      return models.Form.query()
        .where({ category, groupId, isActive: true })
        .orderByRaw("structure->>'name'")
    },
    submissionFormUseCounts: async (_, { groupId }) => {
      const distinctFormPurposesWithCounts = await models.Manuscript.query()
        .select(
          models.Manuscript.raw("submission->>'$$formPurpose' as purpose"),
        )
        .count('* as manuscriptsCount')
        .groupBy('purpose')

      return distinctFormPurposesWithCounts.filter(x => x.purpose !== null)
    },
  },
}

module.exports = resolvers
