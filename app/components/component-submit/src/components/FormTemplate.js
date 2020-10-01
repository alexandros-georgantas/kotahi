import React from 'react'
import styled from 'styled-components'
import { unescape, groupBy, isArray, get, set, cloneDeep } from 'lodash'
import { FieldArray } from 'formik'
import {
  TextField,
  RadioGroup,
  CheckboxGroup,
  Button,
  Attachment,
} from '@pubsweet/ui'
import * as validators from 'xpub-validators'
import { AbstractEditor } from 'xpub-edit'
import { Section as Container, Select, FilesUpload } from '../../../shared'
import { Heading1, Section, Legend, SubNote } from '../style'
import AuthorsInput from './AuthorsInput'
import LinksInput from './LinksInput'
import ValidatedFieldFormik from './ValidatedField'
import Confirm from './Confirm'

const Intro = styled.div`
  font-style: italic;
  line-height: 1.4;
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
`

const filesToAttachment = file => ({
  name: file.filename,
  url: file.url,
})

const stripHtml = htmlString => {
  const temp = document.createElement('span')
  temp.innerHTML = htmlString
  return temp.textContent
}

const filterFileManuscript = files =>
  files.filter(
    file =>
      file.fileType === 'manuscript' &&
      file.mimeType !==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )

// Add the AbstractEditor and AuthorsInput to the list of available form elements
const elements = { TextField, RadioGroup, CheckboxGroup }
elements.AbstractEditor = ({
  validationStatus,
  setTouched,
  onChange,
  value,
  values,
  ...rest
}) => (
  <AbstractEditor
    value={get(values, rest.name) || ''}
    {...rest}
    onChange={val => {
      setTouched(set({}, rest.name, true))
      onChange(stripHtml(val))
    }}
  />
)

elements.AuthorsInput = AuthorsInput
elements.Select = Select
elements.LinksInput = LinksInput

const rejectProps = (obj, keys) =>
  Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => Object.assign({}, { [k]: obj[k] }))
    .reduce(
      (res, o) =>
        Object.values(o).includes('false')
          ? Object.assign({}, res)
          : Object.assign(res, o),
      {},
    )

const link = (journal, manuscript) =>
  String.raw`<a href=/journal/versions/${manuscript.id}/manuscript>view here</a>`

const createMarkup = encodedHtml => ({
  __html: unescape(encodedHtml),
})

const composeValidate = (vld = [], valueField = {}) => value => {
  const validator = vld || []

  if (validator.length === 0) return undefined
  const errors = []
  validator
    .map(v => v.value)
    .map(validatorFn => {
      const error =
        validatorFn === 'required'
          ? validators[validatorFn](value)
          : validators[validatorFn](valueField[validatorFn])(value)
      if (error) {
        errors.push(error)
      }
      return validatorFn
    })
  return errors.length > 0 ? errors[0] : undefined
}

const groupElements = elements => {
  const grouped = groupBy(elements, n => n.group || 'default')

  Object.keys(grouped).forEach(element => {
    grouped[element].sort(
      (obj1, obj2) => parseInt(obj1.order, 10) - parseInt(obj2.order, 10),
    )
  })

  let startArr = grouped.default
  delete grouped.default

  Object.keys(grouped).forEach(element => {
    const { order } = grouped[element][0]
    const first = startArr.findIndex(elem => elem.order === order)
    startArr = startArr
      .slice(0, first)
      .concat([grouped[element]])
      .concat(startArr.slice(first)) // eslint-disable-line no-use-before-define
  })
  return startArr
}

const renderArray = (elementsComponentArray, onChange) => ({
  form: { values, setTouched },
  replace,
  name,
}) =>
  get(values, name).map((elValues, index) => {
    const element = elementsComponentArray.find(elv =>
      Object.values(elValues).includes(elv.type),
    )
    return (
      <Section
        cssOverrides={JSON.parse(element.sectioncss || '{}')}
        key={`${element.id}`}
      >
        <Legend dangerouslySetInnerHTML={createMarkup(element.title)} />
        {/* <p>{JSON.stringify(values)}</p> */}
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
            'order',
            'value',
            'shortDescription',
          ])}
          aria-label={element.shortDescription}
          component={elements[element.component]}
          data-testid={element.name}
          key={`notes-validate-${element.id}`}
          name={`${name}.${index}.content`}
          onChange={value => {
            const data = {
              notesType: element.type,
              content: value,
            }
            replace(index, data, `${name}.[${index}]`, true)
            const notes = cloneDeep(values)
            set(notes, `${name}.[${index}]`, data)
            onChange(notes.meta.notes, `${name}`)
          }}
          readonly={false}
          setTouched={setTouched}
          validate={composeValidate(element.validate, element.validateValue)}
          values={values}
        />
        <SubNote dangerouslySetInnerHTML={createMarkup(element.description)} />
      </Section>
    )
  })

const ElementComponentArray = ({
  elementsComponentArray,
  onChange,
  uploadFile,
}) => (
  <FieldArray
    name={elementsComponentArray[0].group}
    render={renderArray(elementsComponentArray, onChange)}
  />
)

export default ({
  form,
  handleSubmit,
  journal,
  toggleConfirming,
  confirming,
  manuscript,
  setTouched,
  values,
  setFieldValue,
  createSupplementaryFile,
  onChange,
  onSubmit,
  submitSubmission,
  errors,
  validateForm,
  ...props
}) => {
  const submitButton = text => (
    <div>
      <Button
        onClick={async () => {
          const hasErrors = Object.keys(await validateForm()).length !== 0

          // If there are errors, do a fake submit
          // to focus on the error
          if (hasErrors) {
            handleSubmit()
          } else {
            toggleConfirming()
          }
        }}
        primary
        type="button"
      >
        {text}
      </Button>
    </div>
  )

  return (
    <Container>
      <Heading1>{form.name}</Heading1>
      <Intro
        dangerouslySetInnerHTML={createMarkup(
          (form.description || '').replace(
            '###link###',
            link(journal, manuscript),
          ),
        )}
      />
      <form onSubmit={handleSubmit}>
        {groupElements(form.children || []).map((element, i) =>
          !isArray(element) ? (
            <Section
              cssOverrides={JSON.parse(element.sectioncss || '{}')}
              key={`${element.id}`}
            >
              {/* <p>{JSON.stringify(element)}</p> */}
              <Legend dangerouslySetInnerHTML={createMarkup(element.title)} />
              {element.component === 'SupplementaryFiles' && (
                <FilesUpload
                  containerId={manuscript.id}
                  containerName="manuscript"
                  fileType="supplementary"
                  onChange={onChange}
                />
              )}
              {element.component === 'VisualAbstract' && (
                <FilesUpload
                  accept="image/*"
                  containerId={manuscript.id}
                  containerName="manuscript"
                  fileType="visualAbstract"
                  multiple={false}
                  onChange={onChange}
                />
              )}
              {element.component === 'AuthorsInput' && (
                <AuthorsInput data-testid={element.name} onChange={onChange} />
              )}
              {element.component !== 'AuthorsInput' &&
                element.component !== 'SupplementaryFiles' &&
                element.component !== 'VisualAbstract' && (
                  <ValidatedFieldFormik
                    aria-label={element.placeholder || element.title}
                    component={elements[element.component]}
                    data-testid={element.name} // TODO: Improve this
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
                      setFieldValue(element.name, val, true)
                      onChange(val, element.name)
                    }}
                    readonly={false}
                    setTouched={setTouched}
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
                      'order',
                    ])}
                    validate={composeValidate(
                      element.validate,
                      element.validateValue,
                    )}
                    values={values}
                  />
                )}
              <SubNote
                dangerouslySetInnerHTML={createMarkup(element.description)}
              />
            </Section>
          ) : (
            <ElementComponentArray
              elementsComponentArray={element}
              // eslint-disable-next-line
            key={i}
              onChange={onChange}
              setFieldValue={setFieldValue}
              setTouched={setTouched}
            />
          ),
        )}

        {filterFileManuscript(values.files || []).length > 0 ? (
          <Section id="files.manuscript">
            <Legend space>Submitted Manuscript</Legend>
            <Attachment
              file={filesToAttachment(filterFileManuscript(values.files)[0])}
              key={filterFileManuscript(values.files)[0].url}
              uploaded
            />
          </Section>
        ) : null}

        {!['submitted', 'revise'].includes(values.status) &&
          form.haspopup === 'false' && (
            <Button onClick={() => handleSubmit()} primary type="submit">
              Submit your research object
            </Button>
          )}

        {!['submitted', 'revise'].includes(values.status) &&
          form.haspopup === 'true' &&
          submitButton('Submit your research object')}

        {values.status === 'revise' && submitButton('Submit your revision')}

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
      </form>
    </Container>
  )
}
