import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, ErrorMessage } from 'formik'
import { get, set, debounce, merge } from 'lodash'
import { RadioGroup } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import {
  Section as Container,
  Select,
  FilesUpload,
  FieldPublishingSelector,
  TextInput,
  CheckboxGroup,
  RichTextEditor,
  MediumRow,
} from '../../shared'
import {
  Heading1,
  Section,
  Legend,
  SubNote,
} from '../../component-submit/src/style'
import AuthorsInput from '../../component-submit/src/components/AuthorsInput'
import LinksInput from '../../component-submit/src/components/LinksInput'
import ValidatedFieldFormik from '../../component-submit/src/components/ValidatedField'
import Confirm from '../../component-submit/src/components/Confirm'
import { articleStatuses } from '../../../globals'
import { validateFormField } from '../../../shared/formValidation'
import ActionButton from '../../shared/ActionButton'
import { createSafeMarkup, hasValue } from '../../../shared/htmlUtils'
import { ConfigContext } from '../../config/src'
import Modal from '../../component-modal/src/Modal'
import PublishingResponse from '../../component-review/src/components/publishing/PublishingResponse'

const FormContainer = styled(Container)`
  background: white;
  padding: 0;

  header {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* account for <NoteRight> */
    padding: 28px 28px 44px 28px;

    h1 {
      font-weight: 700;
      margin: 0;
      padding: 0;
    }
  }

  form {
    padding: 30px;

    section {
      margin: 0 0 44px 0;
    }
  }
`

const Intro = styled.div`
  line-height: 1.4;

  p {
    margin: 0;
  }
`

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
  margin-top: -${({ theme }) => theme.spacing[1]}px;
`

const SafeRadioGroup = styled(RadioGroup)`
  position: relative;
`

const NoteRight = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  padding: ${({ theme }) => `${theme.spacing.e} ${theme.spacing.f}`};
  text-align: right;
`

const HeadingToolsContainer = styled(MediumRow)`
  float: right;
  width: unset;
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

/** Rename some props so the various formik components can understand them */
const prepareFieldProps = rawField => ({
  ...rawField,
  options:
    rawField.options &&
    rawField.options.map(e => ({ ...e, color: e.labelColor })),
})

/** Fleshes out all fields with empty strings if they have no existing data */
const createInitializedFormData = (form, existingData) => {
  const allBlankedFields = {}
  const fieldNames = form.structure.children.map(field => field.name)
  fieldNames.forEach(fieldName => set(allBlankedFields, fieldName, ''))

  // The following should be stored in the form but not displayed
  if (allBlankedFields.submission) {
    allBlankedFields.submission.$$formPurpose = form.structure.purpose
  }

  return merge(allBlankedFields, existingData)
}

// This is not being kept as state because we need to access it
// outside of the render thread. This is a global variable, NOT
// per component, but that's OK for our purposes.
let lastChangedField = null

const FormTemplate = ({
  form,
  formData,
  customComponents: volatileCustomComponents = {},
  manuscriptId,
  manuscriptShortId,
  submissionButtonText,
  onChange,
  republish,
  onSubmit,
  showEditorOnlyFields,
  displayShortIdAsIdentifier,
  validateDoi,
  validateSuffix,
  createFile,
  deleteFile,
  isSubmission,
  reviewId,
  shouldStoreFilesInForm,
  initializeReview,
  tagForFiles,
  fieldsToPublish,
  setShouldPublishField,
  shouldShowOptionToPublish = false,
  headingControls,
}) => {
  const config = useContext(ConfigContext)
  const [confirming, setConfirming] = React.useState(false)
  const customComponents = useMemo(() => volatileCustomComponents, [])

  const fields = form.structure.children || []

  const toggleConfirming = () => {
    setConfirming(confirm => !confirm)
  }

  const doCustomSubmitActions = async values => {
    await Promise.all(
      fields.map(async field => {
        const customOnSubmit = customComponents[field.component]?.onSubmit
        if (!customOnSubmit) return
        const value = get(values, field.name)
        await customOnSubmit(value)
      }),
    )
  }

  const initialValues = createInitializedFormData(form, formData)

  useEffect(() => {
    if (
      initialValues.submission?.$$formPurpose !==
      formData?.submission?.$$formPurpose
    )
      onChange(
        initialValues.submission.$$formPurpose,
        'submission.$$formPurpose',
      )
  }, [])

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

  const submitButtonTestId = `${form.structure.name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}-action-btn`

  return (
    <Formik
      displayName={form.structure.name}
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        await doCustomSubmitActions(values)
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

        const [
          publishErrorsModalIsOpen,
          setPublishErrorsModalIsOpen,
        ] = useState(false)

        const submitButton = (text, haspopup = false) => {
          return (
            <div>
              <ActionButton
                dataTestid={submitButtonTestId}
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
        const hasPopup = form.structure.haspopup
          ? JSON.parse(form.structure.haspopup)
          : false

        // this is whether to show a popup
        const showPopup = hasPopup && values.status !== 'revise'

        // this is whether or not to show a submit button

        const showSubmitButton =
          submissionButtonText &&
          (isSubmission
            ? !['submitted', 'revise'].includes(values.status) ||
              (['elife', 'ncrc'].includes(config.instanceName) &&
                values.status === 'submitted')
            : true)

        return (
          <FormContainer>
            <header>
              <div>
                <HeadingToolsContainer>
                  {headingControls}
                  {displayShortIdAsIdentifier && (
                    <NoteRight>
                      Manuscript Number: {manuscriptShortId}
                    </NoteRight>
                  )}
                </HeadingToolsContainer>
                <Heading1>{form.structure.name}</Heading1>
              </div>
              <Intro
                dangerouslySetInnerHTML={createSafeMarkup(
                  form.structure.description || '',
                )}
              />
            </header>
            <form>
              {fields
                .filter(
                  element =>
                    element.component &&
                    (showEditorOnlyFields ||
                      element.hideFromAuthors !== 'true'),
                )
                .map(prepareFieldProps)
                .map((element, i) => {
                  const component =
                    customComponents[element.component]?.component ??
                    elements[element.component]

                  const customValidate =
                    customComponents[element.component]?.customValidate

                  let markup = createSafeMarkup(element.title)

                  // add an '*' to the markup if it is marked required
                  if (Array.isArray(element.validate)) {
                    // element.validate can specify multiple validation functions; we're looking for 'required'
                    if (element.validate.some(v => v.value === 'required'))
                      markup = createSafeMarkup(`${element.title} *`)
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
                          onChange={
                            shouldStoreFilesInForm ? innerOnChange : null
                          }
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
                          onChange={
                            shouldStoreFilesInForm ? innerOnChange : null
                          }
                          reviewId={reviewId}
                          values={values}
                        />
                      )}
                      {component && (
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
                          component={component}
                          data-testid={element.name}
                          hasSubmitButton={showSubmitButton}
                          key={`validate-${element.id}`}
                          name={element.name}
                          onChange={value => {
                            // TODO: Perhaps split components remove conditions here
                            let val

                            if (value.target) {
                              val = value.target.value
                            } else if (value.value) {
                              val = value.value
                            } else {
                              val = value
                            }

                            setFieldValue(element.name, val, false)
                            innerOnChange(val, element.name)
                          }}
                          setShouldPublishField={setShouldPublishField}
                          setTouched={setTouched}
                          spellCheck
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
                            customValidate,
                          )}
                          values={values}
                        />
                      )}
                      {hasValue(element.description) && (
                        <SubNote
                          dangerouslySetInnerHTML={createSafeMarkup(
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
                subtitle="Some targets failed to publish."
                title="Publishing error"
              >
                <PublishingResponse response={publishingResponse} />
              </Modal>
            </form>
          </FormContainer>
        )
      }}
    </Formik>
  )
}

FormTemplate.propTypes = {
  form: PropTypes.shape({
    category: PropTypes.string.isRequired,
    structure: PropTypes.shape({
      name: PropTypes.string.isRequired,
      purpose: PropTypes.string.isRequired,
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
  }).isRequired,
  manuscriptId: PropTypes.string.isRequired,
  manuscriptShortId: PropTypes.number.isRequired,
  manuscriptStatus: PropTypes.string,
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
  manuscriptStatus: null,
  shouldStoreFilesInForm: false,
  tagForFiles: null,
  initializeReview: null,
}

export default FormTemplate
