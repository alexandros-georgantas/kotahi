import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, ErrorMessage } from 'formik'
import { unescape, get, set, debounce } from 'lodash'
import { sanitize } from 'isomorphic-dompurify'
import { RadioGroup } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { useTranslation } from 'react-i18next'
import {
  Select,
  FilesUpload,
  Attachment,
  FieldPublishingSelector,
  TextInput,
  CheckboxGroup,
  RichTextEditor,
} from '../shared'
import { Section, Legend, SubNote } from '../component-submit/src/style'
import AuthorsInput from '../component-submit/src/components/AuthorsInput'
import LinksInput from '../component-submit/src/components/LinksInput'
import ValidatedFieldFormik from '../component-submit/src/components/ValidatedField'
import Confirm from '../component-submit/src/components/Confirm'
import { articleStatuses } from '../../globals'
import { validateFormField } from '../../shared/formValidation'
import ThreadedDiscussion from '../component-formbuilder/src/components/builderComponents/ThreadedDiscussion/ThreadedDiscussion'
import ActionButton from '../shared/ActionButton'
import { hasValue } from '../../shared/htmlUtils'
import { ConfigContext } from '../config/src'
import Modal from '../component-modal/src/Modal'
import PublishingResponse from '../component-review/src/components/publishing/PublishingResponse'
import theme from '../../theme'

const ModalWrapper = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10000;
`

const MessageWrapper = styled.div`
  color: ${th('colorError')};
  display: flex;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  margin-left: 12px;
  margin-top: -${theme.spacing.b};
`

const SafeRadioGroup = styled(RadioGroup)`
  position: relative;
`

const FieldHead = styled.div`
  align-items: baseline;
  display: flex;
  width: auto;

  & > label {
    /* this is to make "publish" on decision page go flush right */
    margin-left: auto;
  }
`

const Form = styled.form`
  section {
    margin: 0 0 44px 0;
  }
`

const filterFileManuscript = files =>
  files.filter(file => file.tags.includes('manuscript'))

/** Definitions for available field types */
const elements = {
  Title: TextInput,
  Authors: AuthorsInput,
  Abstract: RichTextEditor,
  Keywords: TextInput,
  TextField: TextInput,
  AbstractEditor: RichTextEditor,
  RadioGroup: SafeRadioGroup,
  CheckboxGroup,
  AuthorsInput,
  Select,
  LinksInput,
  ThreadedDiscussion,
}

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

const createMarkup = encodedHtml => ({
  __html: sanitize(unescape(encodedHtml)),
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
  manuscriptId,
  submissionButtonText,
  onChange,
  republish,
  onSubmit,
  showEditorOnlyFields,
  validateDoi,
  validateSuffix,
  createFile,
  deleteFile,
  isSubmission,
  reviewId,
  shouldStoreFilesInForm,
  initializeReview,
  tagForFiles,
  threadedDiscussionProps: tdProps,
  fieldsToPublish,
  setShouldPublishField,
  shouldShowOptionToPublish = false,
}) => {
  const config = useContext(ConfigContext)
  const [confirming, setConfirming] = React.useState(false)

  const toggleConfirming = () => {
    setConfirming(confirm => !confirm)
  }

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

  const createBlankSubmissionBasedOnForm = value => {
    const allBlankedFields = {}
    const fieldNames = value.children.map(field => field.name)
    fieldNames.forEach(fieldName => set(allBlankedFields, fieldName, ''))
    return allBlankedFields
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
      onSubmit={async (values, actions) => {
        await sumbitPendingThreadedDiscussionComments(values)
        if (onSubmit) await onSubmit(values, actions)
      }}
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
        const innerOnChange = (value, fieldName) => {
          if (fieldName !== lastChangedField) {
            debounceChange.flush()
            lastChangedField = fieldName
          }

          debounceChange(value, fieldName)
        }

        const [submitSucceeded, setSubmitSucceeded] = useState(false)
        const [buttonIsPending, setButtonIsPending] = useState(false)
        const [publishingResponse, setPublishingResponse] = useState([])
        const { t } = useTranslation()

        const [publishErrorsModalIsOpen, setPublishErrorsModalIsOpen] =
          useState(false)

        const submitButton = (text, haspopup = false) => {
          return (
            <div>
              <ActionButton
                dataTestid={`${form.name
                  ?.toLowerCase()
                  .replace(/ /g, '-')
                  .replace(/[^\w-]+/g, '')}-action-btn`}
                onClick={async () => {
                  setButtonIsPending(true)

                  const hasErrors =
                    Object.keys(await validateForm()).length !== 0

                  // If there are errors, do a fake submit
                  // to focus on the error
                  if (
                    hasErrors ||
                    values.status === articleStatuses.evaluated ||
                    values.status === articleStatuses.submitted ||
                    !haspopup
                  ) {
                    handleSubmit()
                    setSubmitSucceeded(!hasErrors)
                  } else {
                    toggleConfirming()
                  }

                  if (!hasErrors && republish) {
                    const response = (await republish(
                      manuscriptId,
                      config.groupId,
                    )) || {
                      steps: [],
                    }

                    setPublishingResponse(response)
                    if (response.steps.some(step => !step.succeeded))
                      setPublishErrorsModalIsOpen(true)
                  }

                  setButtonIsPending(false)
                }}
                primary
                status={
                  /* eslint-disable no-nested-ternary */
                  buttonIsPending || isSubmitting
                    ? 'pending'
                    : publishingResponse?.steps?.some(step => !step.succeeded)
                    ? 'failure'
                    : Object.keys(errors).length && submitCount
                    ? '' // TODO Make this case 'failure', once we've fixed the validation delays in the form
                    : submitSucceeded
                    ? 'success'
                    : ''
                  /* eslint-enable no-nested-ternary */
                }
              >
                {text}
              </ActionButton>
            </div>
          )
        }

        // this is whether the form includes a popup
        const hasPopup = form.haspopup ? JSON.parse(form.haspopup) : false

        // this is whether to show a popup
        const showPopup = hasPopup && values.status !== 'revise'

        // this is whether or not to show a submit button

        const showSubmitButton =
          submissionButtonText &&
          (isSubmission
            ? !['submitted', 'revise'].includes(values.status) ||
              (['preprint1', 'preprint2'].includes(config.instanceName) &&
                values.status === 'submitted')
            : true)

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
                let threadedDiscussionProps

                if (element.component === 'ThreadedDiscussion') {
                  const setShouldPublishComment =
                    shouldShowOptionToPublish &&
                    element.permitPublishing === 'true' &&
                    ((id, val) =>
                      setShouldPublishField(`${element.name}:${id}`, val))

                  threadedDiscussionProps = {
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

                let markup = createMarkup(element.title)

                // add an '*' to the markup if it is marked required
                if (Array.isArray(element.validate)) {
                  // element.validate can specify multiple validation functions; we're looking for 'required'
                  if (element.validate.some(v => v.value === 'required'))
                    markup = createMarkup(`${element.title} *`)
                }

                return (
                  <Section
                    cssOverrides={JSON.parse(element.sectioncss || '{}')}
                    key={`${element.id}`}
                  >
                    <FieldHead>
                      <Legend dangerouslySetInnerHTML={markup} />
                      {shouldShowOptionToPublish &&
                        element.permitPublishing === 'true' &&
                        element.component !== 'ThreadedDiscussion' && (
                          <FieldPublishingSelector
                            onChange={val =>
                              setShouldPublishField(element.name, val)
                            }
                            value={fieldsToPublish.includes(element.name)}
                          />
                        )}
                      <MessageWrapper>
                        <ErrorMessage name={element.name} />
                      </MessageWrapper>
                    </FieldHead>
                    {element.component === 'SupplementaryFiles' && (
                      <FilesUpload
                        createFile={createFile}
                        deleteFile={deleteFile}
                        fieldName={
                          shouldStoreFilesInForm ? element.name : 'files'
                        } // TODO Store files in form for submissions too: should simplify code both frontend and back.
                        fileType={tagForFiles || 'supplementary'}
                        initializeReview={initializeReview}
                        manuscriptId={manuscriptId}
                        onChange={shouldStoreFilesInForm ? innerOnChange : null}
                        reviewId={reviewId}
                        values={values}
                      />
                    )}
                    {element.component === 'VisualAbstract' && (
                      <FilesUpload
                        acceptMultiple={false}
                        createFile={createFile}
                        deleteFile={deleteFile}
                        fieldName={
                          shouldStoreFilesInForm ? element.name : 'files'
                        }
                        fileType={tagForFiles || 'visualAbstract'}
                        initializeReview={initializeReview}
                        manuscriptId={manuscriptId}
                        mimeTypesToAccept="image/*"
                        onChange={shouldStoreFilesInForm ? innerOnChange : null}
                        reviewId={reviewId}
                        values={values}
                      />
                    )}
                    {element.component === 'ManuscriptFile' &&
                    submittedManuscriptFile ? (
                      <Attachment
                        file={submittedManuscriptFile}
                        key={submittedManuscriptFile.storedObjects[0].url}
                        uploaded
                      />
                    ) : null}
                    {![
                      'SupplementaryFiles',
                      'VisualAbstract',
                      'ManuscriptFile',
                    ].includes(element.component) && (
                      <ValidatedFieldFormik
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
                        component={elements[element.component]}
                        data-testid={element.name} // TODO: Improve this
                        isClearable={
                          element.component === 'Select' &&
                          element.name === 'submission.$customStatus'
                        }
                        key={`validate-${element.id}`}
                        name={element.name}
                        onChange={value => {
                          // TODO: Perhaps split components remove conditions here
                          let val

                          if (value?.target) {
                            val = value.target.value
                          } else if (value?.value) {
                            val = value.value
                          } else {
                            val = value
                          }

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
                          JSON.parse(
                            element.doiUniqueSuffixValidation || false,
                          ),
                          validateDoi,
                          validateSuffix,
                          element.component,
                          threadedDiscussionProps,
                        )}
                        values={values}
                      />
                    )}
                    {hasValue(element.description) && (
                      <SubNote
                        dangerouslySetInnerHTML={createMarkup(
                          element.description,
                        )}
                      />
                    )}
                  </Section>
                )
              })}

            {showSubmitButton
              ? submitButton(submissionButtonText, showPopup)
              : null}

            {confirming && (
              <ModalWrapper>
                <Confirm
                  errors={errors}
                  form={form}
                  submit={handleSubmit}
                  toggleConfirming={toggleConfirming}
                />
              </ModalWrapper>
            )}
            <Modal
              isOpen={publishErrorsModalIsOpen}
              onClose={() => setPublishErrorsModalIsOpen(false)}
              subtitle={t('modals.publishError.Some targets failed to publish')}
              title={t('modals.publishError.Publishing error')}
            >
              <PublishingResponse response={publishingResponse} />
            </Modal>
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
  manuscriptId: PropTypes.string.isRequired,
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
  republish: PropTypes.func,
  submissionButtonText: PropTypes.string,
  showEditorOnlyFields: PropTypes.bool.isRequired,
  shouldStoreFilesInForm: PropTypes.bool,
  /** If supplied, any uploaded files will be tagged with this rather than 'supplementary' or 'visualAbstract' */
  tagForFiles: PropTypes.string,
  initializeReview: PropTypes.func,
}
FormTemplate.defaultProps = {
  onSubmit: undefined,
  initialValues: null,
  republish: null,
  submissionButtonText: '',
  shouldStoreFilesInForm: false,
  tagForFiles: null,
  initializeReview: null,
}

export default FormTemplate
