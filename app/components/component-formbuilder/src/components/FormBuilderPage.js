import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { cloneDeep, omitBy } from 'lodash'
import { ConfigContext } from '../../../config/src'
import FormBuilderLayout from './FormBuilderLayout'
import { Spinner, CommsErrorBanner } from '../../../shared'
import pruneEmpty from '../../../../shared/pruneEmpty'

const formFieldsSegment = `
id
created
updated
category
isActive
isDefault
groupId
structure {
  name
  purpose
  description
  haspopup
  popuptitle
  popupdescription
  children
}
`

const createFormMutation = gql`
  mutation($form: CreateFormInput!) {
    createForm(form: $form) {
      id
    }
  }
`

const updateFormMutation = gql`
  mutation($form: FormInput!) {
    updateForm(form: $form) {
      ${formFieldsSegment}
    }
  }
`

const updateFormElementMutation = gql`
  mutation($element: JSON!, $formId: ID!, $parentElementId: ID) {
    updateFormElement(
      element: $element
      formId: $formId
      parentElementId: $parentElementId
    ) {
      id
    }
  }
`

const deleteFormElementMutation = gql`
  mutation($formId: ID!, $elementId: ID!) {
    deleteFormElement(formId: $formId, elementId: $elementId) {
      id
    }
  }
`

const deleteFormMutation = gql`
  mutation($formId: ID!) {
    deleteForm(formId: $formId)
  }
`

const query = gql`
  query GET_FORMS($category: String!, $groupId: ID!) {
    allFormsInCategory(category: $category, groupId: $groupId) {
      ${formFieldsSegment}
    }

    submissionFormUseCounts(groupId: $groupId) {
      purpose
      manuscriptsCount
    }
  }
`

const prepareForSubmit = values => {
  const cleanedValues = omitBy(cloneDeep(values), value => value === '')
  return cleanedValues
}

const getFormUseCountsMap = (countsArray = []) => {
  const result = {}
  countsArray.forEach(x => {
    result[x.purpose] = x.manuscriptsCount
  })
  return result
}

const FormBuilderPage = ({ category }) => {
  const config = useContext(ConfigContext)

  const { loading, data, error } = useQuery(query, {
    variables: { category, groupId: config.groupId },
  })

  const cleanedForms = pruneEmpty(data?.allFormsInCategory)

  // TODO Structure forms for graphql and retrieve IDs from these mutations to allow Apollo Cache to do its magic, rather than forcing refetch.
  const [deleteForm] = useMutation(deleteFormMutation, {
    refetchQueries: [
      { query, variables: { category, groupId: config.groupId } },
    ],
  })

  const [deleteFormElement] = useMutation(deleteFormElementMutation, {
    refetchQueries: [
      { query, variables: { category, groupId: config.groupId } },
    ],
  })

  const [updateForm] = useMutation(updateFormMutation, {
    refetchQueries: [
      { query, variables: { category, groupId: config.groupId } },
    ],
  })

  const [updateFormElement] = useMutation(updateFormElementMutation, {
    refetchQueries: [
      { query, variables: { category, groupId: config.groupId } },
    ],
  })

  const [createForm] = useMutation(createFormMutation, {
    refetchQueries: [
      { query, variables: { category, groupId: config.groupId } },
    ],
  })

  const [selectedFormId, setSelectedFormId] = useState(null)
  const [selectedFieldId, setSelectedFieldId] = useState()
  const [formFields, setFormFields] = useState(cleanedForms)

  useEffect(() => {
    setFormFields(cleanedForms)
  }, [data?.allFormsInCategory])

  const moveFieldUp = (form, fieldId) => {
    const fields = form.structure.children
    const currentIndex = fields.findIndex(field => field.id === fieldId)
    if (currentIndex < 1) return

    const fieldsToSwapA = fields[currentIndex - 1]
    const fieldsToSwapB = fields[currentIndex]
    const newFields = [...fields]
    newFields.splice(currentIndex - 1, 2, fieldsToSwapB, fieldsToSwapA)

    updateForm({
      variables: {
        form: prepareForSubmit({
          ...form,
          structure: { ...form.structure, children: newFields },
        }),
      },
    })
  }

  const moveFieldDown = (form, fieldId) => {
    const fields = form.structure.children
    const currentIndex = fields.findIndex(field => field.id === fieldId)
    if (currentIndex < 0 || currentIndex >= fields.length - 1) return

    const fieldsToSwapA = fields[currentIndex]
    const fieldsToSwapB = fields[currentIndex + 1]
    const newFields = [...fields]
    newFields.splice(currentIndex, 2, fieldsToSwapB, fieldsToSwapA)

    updateForm({
      variables: {
        form: prepareForSubmit({
          ...form,
          structure: { ...form.structure, children: newFields },
        }),
      },
    })
  }

  const dragField = event => {
    const form = pruneEmpty(
      data.allFormsInCategory.find(f => f.id === selectedFormId),
    )

    const fields = form.structure.children
    const fromIndex = event.source.index
    const toIndex = event.destination.index
    const draggedField = fields[fromIndex]
    const newFields = [...fields]
    newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, draggedField)
    setFormFields([
      { ...form, structure: { ...form.structure, children: newFields } },
    ])

    updateForm({
      variables: {
        form: prepareForSubmit({
          ...form,
          structure: { ...form.structure, children: newFields },
        }),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateForm: {
          id: form.id,
          __typename: 'FormStructure',
          structure: { ...form.structure, children: newFields },
        },
      },
    })
  }

  useEffect(() => {
    if (data?.allFormsInCategory?.length) {
      setSelectedFormId(
        prevFormId =>
          data.allFormsInCategory.find(f => f.id === prevFormId)?.id ??
          data.allFormsInCategory.find(f => f.isDefault)?.id ??
          data.allFormsInCategory[0]?.id,
      )
    }
  }, [data])

  const submissionFormUseCounts = useMemo(
    () => getFormUseCountsMap(data?.submissionFormUseCounts),
    [data],
  )

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  return (
    <FormBuilderLayout
      category={category}
      createForm={async payload => {
        const result = await createForm(payload)
        setSelectedFormId(result.data.createForm.id)
      }}
      deleteField={deleteFormElement}
      deleteForm={deleteForm}
      dragField={dragField}
      forms={formFields}
      moveFieldDown={moveFieldDown}
      moveFieldUp={moveFieldUp}
      selectedFieldId={selectedFieldId}
      selectedFormId={selectedFormId}
      setSelectedFieldId={setSelectedFieldId}
      setSelectedFormId={setSelectedFormId}
      shouldAllowHypothesisTagging={
        config?.publishing?.hypothesis?.shouldAllowTagging
      }
      submissionFormUseCounts={submissionFormUseCounts}
      updateField={updateFormElement}
      updateForm={updateForm}
    />
  )
}

export default FormBuilderPage
