import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, get } from 'lodash'
import { FieldArray } from 'formik'
import { grid, th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import UploadingFile from './UploadingFile'
import { Dropzone } from './Dropzone'
import { Icon } from './Icon'
import theme from '../../theme'

const Root = styled.div`
  border: 1px dashed ${th('colorBorder')};
  border-radius: ${th('borderRadius')};
  height: ${grid(8)};
  line-height: ${grid(8)};
  text-align: center;
`

const Files = styled.div`
  display: grid;
  grid-gap: ${grid(2)};
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-top: ${grid(2)};
`

const Message = styled.div`
  align-items: center;
  color: ${props => (props.disabled ? th('colorTextPlaceholder') : 'inherit')};
  display: flex;
  justify-content: center;
  width: 100%;

  svg {
    margin-left: ${grid(1)};
  }
`

const DropzoneAndList = ({
  form: { values, setFieldValue },
  push,
  insert,
  remove,
  createFile,
  deleteFile,
  fileType,
  fieldName,
  acceptMultiple,
  mimeTypesToAccept,
}) => {
  // Disable the input in case we want a single file upload
  // and a file has already been uploaded
  const files = cloneDeep(get(values, fieldName) || [])
    .map((file, index) => {
      // This is so that we preserve the location of the file in the top-level
      // files array (needed for deletion).
      /* eslint-disable-next-line no-param-reassign */
      file.originalIndex = index
      return file
    })
    .filter(val => (fileType ? val.tags.includes(fileType) : true))

  const disabled = !acceptMultiple && !!files.length

  return (
    <>
      <Dropzone
        accept={mimeTypesToAccept}
        disabled={disabled}
        multiple={acceptMultiple}
        onDrop={async dropFiles => {
          Array.from(dropFiles).forEach(async file => {
            const data = await createFile(file)
            push(data.createFile)
          })
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <Root {...getRootProps()} data-testid="dropzone">
            <input {...getInputProps()} />
            <Message disabled={disabled}>
              {disabled ? (
                'Your file has been uploaded.'
              ) : (
                <>
                  Drag and drop your files here
                  <Icon color={theme.colorPrimary} inline>
                    file-plus
                  </Icon>
                </>
              )}
            </Message>
          </Root>
        )}
      </Dropzone>
      <Files>
        {files.map(file => (
          <UploadingFile
            deleteFile={deleteFile}
            file={file}
            index={file.originalIndex}
            key={file.name}
            remove={remove}
            uploaded
          />
        ))}
      </Files>
    </>
  )
}

DropzoneAndList.propTypes = {
  form: PropTypes.shape({
    values: PropTypes.shape({}),
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  push: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  fileType: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  acceptMultiple: PropTypes.bool,
  mimeTypesToAccept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
  ]),
}

DropzoneAndList.defaultProps = {
  acceptMultiple: true,
  mimeTypesToAccept: undefined,
}

const FilesUpload = ({
  fileType,
  fieldName = 'files',
  manuscriptId,
  reviewId,
  initializeReview,
  acceptMultiple = true,
  mimeTypesToAccept,
  createFile: createF,
  deleteFile: deleteF,
  updateReviewJsonData,
  values,
}) => {
  let existingFiles = []

  if (values?.files) {
    existingFiles = values?.files
  }

  const createFile = async file => {
    const meta = {
      fileType,
      manuscriptId,
      reviewId,
    }

    if (!meta.reviewId && initializeReview)
      meta.reviewId = (await initializeReview()) || null

    const { data } = await createF({
      variables: {
        file,
        meta,
      },
    })

    // Merge the new and existing files
    updateReviewJsonData([...existingFiles, data.createFile], fieldName)

    return data
  }

  const deleteFile = async (file, index, remove) => {
    const { data } = await deleteF({ variables: { id: file.id } })
    remove(index)

    const filteredFiles = existingFiles.filter(
      currFile => currFile.id !== file.id,
    )

    // Update the new array with the file deleted
    updateReviewJsonData(filteredFiles, fieldName)

    return data
  }

  return (
    <FieldArray
      name={fieldName}
      render={formikProps => (
        <DropzoneAndList
          acceptMultiple={acceptMultiple}
          createFile={createFile}
          deleteFile={deleteFile}
          fieldName={fieldName}
          fileType={fileType}
          mimeTypesToAccept={mimeTypesToAccept}
          {...formikProps}
        />
      )}
    />
  )
}

FilesUpload.propTypes = {
  /** The type of attachment, e.g. 'manuscript' (for embedded images), or 'supplementary', 'visualAbstract', 'review', 'confidential', 'decision' */
  fileType: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  /** All files belong to a manuscript */
  manuscriptId: PropTypes.string.isRequired,
  /** Some files may be attached to a review comment (or review decision).
   * If the review hasn't been started yet there may not be an ID
   * assigned for it yet, in which case initializeReview will be
   * called to create a new record in the DB. */
  reviewId: PropTypes.string,
  /** Function to create a new record in DB in case there is no reviewId yet */
  initializeReview: PropTypes.func,
  /** Allow multiple drag/drop or multiple selection in file dialog */
  acceptMultiple: PropTypes.bool,
  mimeTypesToAccept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
  ]),
}

FilesUpload.defaultProps = {
  fieldName: 'files',
  reviewId: null,
  initializeReview: undefined,
  acceptMultiple: true,
  mimeTypesToAccept: undefined,
}

// eslint-disable-next-line import/prefer-default-export
export { FilesUpload }
