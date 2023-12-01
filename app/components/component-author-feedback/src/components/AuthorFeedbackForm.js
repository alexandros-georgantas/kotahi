import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik } from 'formik'
import { useMutation } from '@apollo/client'
import { ValidatedFieldFormik } from '@pubsweet/ui'
import styled from 'styled-components'
import {
  ActionButton,
  PaddedContent,
  FilesUpload,
  Attachment,
} from '../../../shared'
import SimpleWaxEditor from '../../../wax-collab/src/SimpleWaxEditor'
import { CREATE_FILE_MUTATION, DELETE_FILE_MUTATION } from '../../../../queries'
import SubmittedStatus from './SubmittedStatus'
import { Legend } from '../../../component-submit/src/style'
import { ConfigContext } from '../../../config/src'

// Kept the file changes minimal with this single file can be split into separate files in further iterations for code optimization

export const ActionButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: calc(8px * 2) calc(8px * 3);
`

export const FormActionButton = styled(ActionButton)`
  cursor: pointer;
  margin-right: 32px;
  min-width: 104px;
`
// Below are the used Components

const FileInputComponent = ({ entityId, disabled, ...restProps }) => {
  return (
    <FilesUpload
      acceptMultiple
      disabled={disabled}
      fieldName="files"
      fileType="authorFeedback"
      manuscriptId={entityId}
      mimeTypesToAccept="image/*"
      {...restProps}
      onChange={() => {}}
    />
  )
}

const textInput = {
  component: SimpleWaxEditor,
  label: 'Text',
  name: 'text',
  type: 'text',
  otherProps: {},
}

const filesInput = {
  component: FileInputComponent,
  label: 'Attachments',
  name: 'fileIds',
  type: 'file',
  otherProps: {},
}

const required = value => {
  if (
    value === undefined ||
    value === '' ||
    ['<p></p>', '<p class="paragraph"></p>'].includes(value)
  ) {
    return 'Required'
  }

  return undefined
}

const AuthorFeedbackForm = ({
  currentUser,
  manuscript,
  updateManuscript,
  isReadOnlyVersion,
}) => {
  const history = useHistory()
  const config = useContext(ConfigContext)
  const { urlFrag } = config
  const { authorFeedback } = manuscript

  const [readOnly, setReadOnly] = useState(
    !!authorFeedback.submitted || isReadOnlyVersion,
  )

  const submitButtonText = readOnly ? 'Submitted' : 'Submit'

  // Below are the create, delete file and formData save, submit actions
  const [createFile] = useMutation(CREATE_FILE_MUTATION)

  const [deleteFile] = useMutation(DELETE_FILE_MUTATION, {
    update(cache, { data: { deleteFile: fileToDelete } }) {
      const id = cache.identify({
        __typename: 'File',
        id: fileToDelete,
      })

      cache.evict({ id })
    },
  })

  const triggerAutoSave = async formData => {
    await updateManuscript(manuscript.id, {
      authorFeedback: {
        ...formData,
        edited: new Date(),
      },
    })
  }

  const submit = async formData => {
    await updateManuscript(manuscript.id, {
      status: 'completed',
      authorFeedback: {
        text: formData.text,
        fileIds: formData.fileIds,
        submitterId: currentUser.id,
        submitted: new Date(),
      },
    })
    setReadOnly(true)

    setTimeout(() => {
      history.push(`${urlFrag}/dashboard`)
    }, 2000)
  }

  // Initial data for the form
  const setInitialData = authorFeedbackData => {
    let initialData = {}
    initialData = { ...authorFeedbackData }

    initialData.text = authorFeedbackData.text ? authorFeedbackData.text : ''
    initialData.fileIds = authorFeedbackData.fileIds
      ? authorFeedbackData.fileIds
      : []
    initialData.files = authorFeedbackData.files ? authorFeedbackData.files : []
    return initialData
  }

  return (
    <>
      <Formik
        initialValues={setInitialData(authorFeedback)}
        onSubmit={async values => submit(values)}
      >
        {formikProps => {
          const [selectedFiles, setSelectedFiles] = useState(
            formikProps.values.fileIds,
          )

          const onDataChanged = (name, value) => {
            formikProps.setFieldValue(name, value)
            triggerAutoSave({ [name]: value })
          }

          const onFileAdded = file => {
            setSelectedFiles(current => {
              const currentFiles = [...current]
              currentFiles.push(file.id)
              onDataChanged('fileIds', currentFiles)
              return currentFiles
            })
          }

          const onFileRemoved = file => {
            setSelectedFiles(current => {
              const currentFiles = current.filter(id => id !== file.id)
              onDataChanged('fileIds', currentFiles)
              return currentFiles
            })
          }

          return (
            <>
              <PaddedContent>
                <Legend>Feedback</Legend>
                <ValidatedFieldFormik
                  component={textInput.component}
                  key={textInput.name}
                  name={textInput.name}
                  onChange={value => onDataChanged(textInput.name, value)}
                  readonly={readOnly}
                  setFieldValue={formikProps.setFieldValue}
                  setTouched={formikProps.setTouched}
                  type={textInput.type}
                  validate={required}
                  {...textInput.otherProps}
                />
              </PaddedContent>
              <PaddedContent key={filesInput.name}>
                <Legend>Attachments</Legend>
                {readOnly ? (
                  authorFeedback.files.map(file => (
                    <Attachment
                      file={file}
                      key={file.storedObjects[0].url}
                      uploaded
                    />
                  ))
                ) : (
                  <ValidatedFieldFormik
                    component={filesInput.component}
                    confirmBeforeDelete
                    createFile={createFile}
                    deleteFile={deleteFile}
                    entityId={manuscript.id}
                    key={selectedFiles.length}
                    name={filesInput.name}
                    onFileAdded={onFileAdded}
                    onFileRemoved={onFileRemoved}
                    setFieldValue={formikProps.setFieldValue}
                    setTouched={formikProps.setTouched}
                    type={filesInput.type}
                    values={{
                      files: selectedFiles,
                    }}
                    {...filesInput.otherProps}
                  />
                )}
              </PaddedContent>
              <ActionButtonContainer>
                <div>
                  <FormActionButton
                    disabled={readOnly}
                    onClick={formikProps.handleSubmit}
                    primary
                    type="button"
                  >
                    {submitButtonText}
                  </FormActionButton>
                </div>
                <SubmittedStatus authorFeedback={authorFeedback} />
              </ActionButtonContainer>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default AuthorFeedbackForm
