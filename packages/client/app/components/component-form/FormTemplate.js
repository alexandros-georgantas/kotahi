import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, ErrorMessage } from 'formik'
import { unescape, get, set, debounce } from 'lodash'
import { sanitize } from 'isomorphic-dompurify'
import { Attachment, FieldPublishingSelector } from '../shared'
import ValidatedField from '../component-submit/src/components/ValidatedField'
import { validateFormField } from '../../shared/formValidation'
import { hasValue } from '../../shared/htmlUtils'
import FormSubmitButton from './FormSubmitButton'
import fieldComponents from './fieldComponents'
import FieldLayout from './FieldLayout'

const Form = styled.form`
  section {
    margin: 0 0 44px 0;
  }
`

const filterFileManuscript = files =>
  files.filter(file => file.tags.includes('manuscript'))

/** Shallow clone props, leaving out all specified keys, and also stripping all keys with (string) value 'false'. */
const rejectProps = (obj, keys) =>
  Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => ({ [k]: obj[k] }))
    .reduce(
      (res, o) =>
        Object.values(o).includes('false') ? { ...res } : Object.assign(res, o),
      {},
    )

const fieldIsRequired = el =>
  Array.isArray(el.validate) && el.validate.some(v => v.value === 'required')

const createMarkup = (encodedHtml, isRequired) => ({
  __html: sanitize(unescape(`${encodedHtml}${isRequired ? ' *' : ''}`)),
})

/** Rename some props so the various formik components can understand them */
const prepareFieldProps = rawField => ({
  ...rawField,
  options:
    rawField.options &&
    rawField.options.map(e => ({ ...e, color: e.labelColor })),
})

// This is not being kept as state because we need to access it
// outside of the render thread. This is a global variable, NOT
// per component, but that's OK for our purposes.
let lastChangedField = null

const FormTemplate = ({
  form,
  initialValues,
  objectId,
  submissionButtonText,
  onChange,
  onSubmit,
  showEditorOnlyFields,
  validateDoi,
  validateSuffix,
  createFile,
  deleteFile,
  isSubmission,
  tagForFiles,
  threadedDiscussionProps: tdProps,
  fieldsToPublish,
  setShouldPublishField,
  shouldShowOptionToPublish = false,
}) => {
  const [submitButtonOverrideStatus, setSubmitButtonOverrideStatus] =
    useState(null)

  const sumbitPendingThreadedDiscussionComments = async values => {
    await Promise.all(
      form.children
        .filter(field => field.component === 'ThreadedDiscussion')
        .map(field => get(values, field.name))
        .filter(Boolean)
        .map(async threadedDiscussionId =>
          tdProps.completeComments({
            variables: { threadedDiscussionId },
          }),
        ),
    )
  }

  const getThreadedDiscussionPropsForField = (element, values) => {
    if (element.component === 'ThreadedDiscussion') {
      const setShouldPublishComment =
        shouldShowOptionToPublish &&
        element.permitPublishing === 'true' &&
        ((id, val) => setShouldPublishField(`${element.name}:${id}`, val))

      return {
        ...tdProps,
        threadedDiscussion: tdProps.threadedDiscussions.find(
          d => d.id === values[element.name],
        ),
        threadedDiscussions: undefined,
        commentsToPublish: fieldsToPublish
          .filter(f => f.startsWith(`${element.name}:`))
          .map(f => f.split(':')[1]),
        setShouldPublishComment,
        userCanAddThread: true,
      }
    }

    return undefined
  }

  const createBlankSubmissionBasedOnForm = value => {
    const allBlankedFields = {}
    const fieldNames = value.children.map(field => field.name)
    fieldNames.forEach(fieldName => set(allBlankedFields, fieldName, ''))
    return allBlankedFields
  }

  const onSubmitForm = async (values, actions) => {
    await sumbitPendingThreadedDiscussionComments(values)

    if (onSubmit) {
      setSubmitButtonOverrideStatus(null)
      const status = await onSubmit(values, actions)
      if (status) setSubmitButtonOverrideStatus(status)
    }
  }

  const initialValuesWithDummyValues = {
    ...createBlankSubmissionBasedOnForm(form),
    ...initialValues,
  }

  const debounceChange = useCallback(
    debounce(
      onChange
        ? (...params) => {
            onChange(...params)
          }
        : () => {},
      1000,
    ),
    [],
  )

  useEffect(() => debounceChange.flush, [])

  return (
    <Formik
      displayName={form.name}
      initialValues={initialValuesWithDummyValues}
      onSubmit={onSubmitForm}
      validateOnBlur
      validateOnChange={false}
    >
      {({
        handleSubmit,
        setTouched,
        values,
        setFieldValue,
        errors,
        validateForm,
        isSubmitting,
        submitCount,
      }) => {
        /** Handle a value change on any field by passing it via debounce to onChange.
         * Because we only use a single debounce, we need to flush the debounce whenever
         * editing shifts to a new field. */
        const innerOnChange = (value, fieldName) => {
          if (fieldName !== lastChangedField) {
            debounceChange.flush()
            lastChangedField = fieldName
          }

          debounceChange(value, fieldName)
        }

        const manuscriptFiles = filterFileManuscript(values.files || [])

        const submittedManuscriptFile =
          isSubmission && manuscriptFiles.length ? manuscriptFiles[0] : null

        return (
          <Form>
            {(form.children || [])
              .filter(
                element =>
                  element.component &&
                  (showEditorOnlyFields || element.hideFromAuthors !== 'true'),
              )
              .map(prepareFieldProps)
              .map((element, i) => {
                const threadedDiscussionProps =
                  getThreadedDiscussionPropsForField(element, values)

                const markup = createMarkup(
                  element.title,
                  fieldIsRequired(element),
                )

                const publishingSelector =
                  shouldShowOptionToPublish &&
                  element.permitPublishing === 'true' &&
                  element.component !== 'ThreadedDiscussion' ? (
                    <FieldPublishingSelector
                      onChange={val => setShouldPublishField(element.name, val)}
                      value={fieldsToPublish.includes(element.name)}
                    />
                  ) : null

                let field = null

                if (element.component === 'ManuscriptFile') {
                  if (submittedManuscriptFile)
                    field = (
                      <Attachment
                        file={submittedManuscriptFile}
                        key={submittedManuscriptFile.storedObjects[0].url}
                        uploaded
                      />
                    )
                } else {
                  field = (
                    <ValidatedField
                      {...rejectProps(element, [
                        'component',
                        'title',
                        'sectioncss',
                        'parse',
                        'format',
                        'validate',
                        'validateValue',
                        'description',
                        'shortDescription',
                        'labelColor',
                      ])}
                      aria-label={element.placeholder || element.title}
                      component={fieldComponents[element.component]}
                      createFile={createFile}
                      data-testid={element.name}
                      deleteFile={deleteFile}
                      fileType={tagForFiles}
                      isClearable={
                        element.component === 'Select' &&
                        element.name === 'submission.$customStatus'
                      }
                      key={`validate-${element.id}`}
                      name={element.name}
                      objectId={objectId}
                      onChange={value => {
                        let val

                        if (value?.target) {
                          val = value.target.value
                        } else if (value?.value) {
                          val = value.value
                        } else {
                          val = value
                        }

                        if (
                          !['SupplementaryFiles', 'VisualAbstract'].includes(
                            element.component,
                          )
                        )
                          setFieldValue(element.name, val, false)

                        innerOnChange(val, element.name)
                      }}
                      setTouched={setTouched}
                      spellCheck
                      threadedDiscussionProps={threadedDiscussionProps}
                      validate={validateFormField(
                        element.validate,
                        element.validateValue,
                        element.name,
                        JSON.parse(element.doiValidation || false),
                        JSON.parse(element.doiUniqueSuffixValidation || false),
                        validateDoi,
                        validateSuffix,
                        element.component,
                        threadedDiscussionProps,
                      )}
                      values={values}
                    />
                  )
                }

                const subNote = hasValue(element.description) ? (
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={createMarkup(element.description)}
                  />
                ) : null

                return (
                  <FieldLayout
                    cssOverrides={JSON.parse(element.sectioncss || '{}')}
                    errorMessage={<ErrorMessage name={element.name} />}
                    field={field}
                    key={`${element.id}`}
                    // eslint-disable-next-line react/no-danger
                    label={<div dangerouslySetInnerHTML={markup} />}
                    publishingSelector={publishingSelector}
                    subNote={subNote}
                  />
                )
              })}

            {submissionButtonText && (
              <FormSubmitButton
                errors={errors}
                form={form}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitButtonOverrideStatus={submitButtonOverrideStatus}
                submitCount={submitCount}
                text={submissionButtonText}
                validateForm={validateForm}
                values={values}
              />
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

FormTemplate.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        sectioncss: PropTypes.string,
        id: PropTypes.string.isRequired,
        component: PropTypes.string.isRequired,
        group: PropTypes.string,
        placeholder: PropTypes.string,
        validate: PropTypes.arrayOf(PropTypes.object.isRequired),
        validateValue: PropTypes.objectOf(
          PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ),
        hideFromAuthors: PropTypes.string,
        readonly: PropTypes.bool,
      }).isRequired,
    ).isRequired,
    popuptitle: PropTypes.string,
    popupdescription: PropTypes.string,
    haspopup: PropTypes.string.isRequired, // bool as string
  }).isRequired,
  /** The object the form data belongs to, e.g. a manuscript or review */
  objectId: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    files: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string.isRequired),
        // eslint-disable-next-line react/forbid-prop-types
        storedObjects: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    ),
    status: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  submissionButtonText: PropTypes.string,
  showEditorOnlyFields: PropTypes.bool.isRequired,
  /** The tag to give new files: e.g. 'submission', 'review' or 'decision' */
  tagForFiles: PropTypes.string.isRequired,
}
FormTemplate.defaultProps = {
  onSubmit: undefined,
  initialValues: null,
  submissionButtonText: '',
}

export default FormTemplate
