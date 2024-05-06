import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { PaddedSectionContent } from '../../../shared'
import FormTemplate, { FormIntro } from '../../../component-form'
import { articleStatuses } from '../../../../globals'
import { ConfigContext } from '../../../config/src'
import Modal from '../../../component-modal/src/Modal'
import PublishingResponse from '../../../component-review/src/components/publishing/PublishingResponse'

const SubmissionForm = ({
  versionValues,
  form,
  onSubmit,
  onChange,
  republish,
  match,
  manuscript,
  createFile,
  deleteFile,
  setShouldPublishField,
  threadedDiscussionProps,
  validateDoi,
  validateSuffix,
}) => {
  const config = useContext(ConfigContext)
  const { t } = useTranslation()

  const [publishingResponse, setPublishingResponse] = useState([])

  const [publishErrorsModalIsOpen, setPublishErrorsModalIsOpen] =
    useState(false)

  let submissionButtonText = null
  let submitButtonShouldRepublish = false

  if (match.url.includes('/evaluation')) {
    if (manuscript.status === articleStatuses.published) {
      submitButtonShouldRepublish = true
      submissionButtonText = 'Republish'
    } else submissionButtonText = 'Submit Evaluation'
  } else if (!['submitted', 'revise'].includes(manuscript.status)) {
    submissionButtonText = t('manuscriptSubmit.Submit your research object')
  }

  return (
    <PaddedSectionContent>
      <FormIntro form={form} manuscriptId={manuscript.id} />
      <hr />
      <FormTemplate
        createFile={createFile}
        deleteFile={deleteFile}
        fieldsToPublish={
          manuscript.formFieldsToPublish.find(
            ff => ff.objectId === manuscript.id,
          )?.fieldsToPublish ?? []
        }
        form={form}
        initialValues={versionValues}
        manuscriptFile={manuscript.files.find(f =>
          f.tags.includes('manuscript'),
        )}
        objectId={manuscript.id}
        onChange={(value, path) => {
          onChange(value, path, manuscript.id)
        }}
        onSubmit={async (values, { validateForm, setSubmitting, ...other }) => {
          // TODO: Change this to a more Formik idiomatic form
          const isValid = Object.keys(await validateForm()).length === 0

          if (isValid && submitButtonShouldRepublish && republish) {
            const response = (await republish(
              manuscript.id,
              config.groupId,
            )) || {
              steps: [],
            }

            setPublishingResponse(response)

            if (response.steps.some(step => !step.succeeded)) {
              setPublishErrorsModalIsOpen(true)
              setSubmitting(false)
              return 'failure'
            }
          }

          if (isValid) onSubmit(manuscript.id, values)
          // values are currently ignored!
          else setSubmitting(false)

          return 'success'
        }}
        setShouldPublishField={async (fieldName, shouldPublish) =>
          setShouldPublishField({
            variables: {
              manuscriptId: manuscript.id,
              objectId: manuscript.id,
              fieldName,
              shouldPublish,
            },
          })
        }
        shouldShowOptionToPublish={!!setShouldPublishField}
        showEditorOnlyFields={false}
        submissionButtonText={submissionButtonText}
        tagForFiles="submission"
        threadedDiscussionProps={threadedDiscussionProps}
        validateDoi={validateDoi}
        validateSuffix={validateSuffix}
      />
      <Modal
        isOpen={publishErrorsModalIsOpen}
        onClose={() => setPublishErrorsModalIsOpen(false)}
        subtitle={t('modals.publishError.Some targets failed to publish')}
        title={t('modals.publishError.Publishing error')}
      >
        <PublishingResponse response={publishingResponse} />
      </Modal>
    </PaddedSectionContent>
  )
}

export default SubmissionForm
