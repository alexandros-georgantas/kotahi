/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Formik } from 'formik'
import { FilesUpload } from '../../../shared'
import { CompactSection } from '../../../component-cms-manager/src/style'

const setInitialValues = (
  existingConfig,
  selectedFile,
  name,
  tempStoredFiles,
) => {
  const initialData = { ...existingConfig, ...tempStoredFiles?.current }

  if (selectedFile?.length < 1) {
    initialData[name] = [initialData[name]]
  } else {
    initialData[name] = selectedFile
  }

  return initialData
}

const FilesUploadWithOnChange = ({ handleFileChange, ...otherProps }) => (
  <CompactSection>
    <FilesUpload
      {...otherProps}
      onFileAdded={file => handleFileChange(file)}
      onFileRemoved={() => handleFileChange(null)}
    />
  </CompactSection>
)

const BrandIcon = ({
  config,
  createFile,
  name,
  fileType,
  deleteFile,
  mimeTypesToAccept,
  tempStoredFiles,
  ...restProps
}) => {
  const [selectedFile, setSelectedFile] = useState([])

  const handleFileChange = file => {
    setSelectedFile(file)
    // eslint-disable-next-line no-param-reassign
    tempStoredFiles.current[name] = file
  }

  const initialData = setInitialValues(
    config,
    selectedFile,
    name,
    tempStoredFiles,
  )

  return (
    <Formik
      initialValues={initialData}
      onSubmit={actions => {
        actions.setSubmitting(false)
      }}
    >
      <FilesUploadWithOnChange
        acceptMultiple={false}
        confirmBeforeDelete
        createFile={createFile}
        deleteFile={deleteFile}
        fileType={fileType}
        handleFileChange={handleFileChange}
        mimeTypesToAccept={mimeTypesToAccept}
        name={name}
        objectId={config?.id}
        {...restProps}
      />
    </Formik>
  )
}

export default BrandIcon
