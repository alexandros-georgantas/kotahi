/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Formik } from 'formik'
import { FilesUpload } from '../../../shared'
import { CompactSection } from '../../../component-cms-manager/src/style'

const setInitialValues = (existingConfig, selectedFile, fieldName) => {
  const storedTempFile = localStorage.getItem('storedLogoAndFaviconConfig')
  const parsedTempFile = JSON.parse(storedTempFile) || {}
  const initialData = { ...existingConfig, ...parsedTempFile }

  if (selectedFile?.length < 1) {
    initialData[fieldName] = [initialData[fieldName]]
  } else {
    initialData[fieldName] = selectedFile
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
  fieldName,
  fileType,
  deleteFile,
  mimeTypesToAccept,
  ...restProps
}) => {
  const [selectedFile, setSelectedFile] = useState([])

  const handleFileChange = file => {
    const storedTempFile = localStorage.getItem('storedLogoAndFaviconConfig')
    const parsedTempFile = JSON.parse(storedTempFile) || {}
    setSelectedFile(file)
    parsedTempFile[fieldName] = file
    localStorage.setItem(
      'storedLogoAndFaviconConfig',
      JSON.stringify(parsedTempFile),
    )
  }

  const initialData = setInitialValues(config, selectedFile, fieldName)

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
        fieldName={fieldName}
        fileType={fileType}
        handleFileChange={handleFileChange}
        manuscriptId={config?.id}
        mimeTypesToAccept={mimeTypesToAccept}
        {...restProps}
      />
    </Formik>
  )
}

export default BrandIcon
