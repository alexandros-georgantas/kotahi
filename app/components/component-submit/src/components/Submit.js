import React, { useCallback, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { set, debounce } from 'lodash'
import { ConfigContext } from '../../../config/src'
import DecisionAndReviews from './DecisionAndReviews'
import CreateANewVersion from './CreateANewVersion'
import ReadonlyFormTemplate from '../../../component-review/src/components/metadata/ReadonlyFormTemplate'
import MessageContainer from '../../../component-chat/src/MessageContainer'

import {
  VersionSwitcher,
  HiddenTabs,
  Columns,
  Chat,
  Manuscript,
  ErrorBoundary,
} from '../../../shared'

// TODO: Improve the import, perhaps a shared component?
import EditorSection from '../../../component-review/src/components/decision/EditorSection'
import AssignEditorsReviewers from './assignEditors/AssignEditorsReviewers'
import AssignEditor from './assignEditors/AssignEditor'
import SubmissionForm from './SubmissionForm'

export const createBlankSubmissionBasedOnForm = form => {
  const allBlankedFields = {}
  const fieldNames = form.children.map(field => field.name)
  fieldNames.forEach(fieldName => set(allBlankedFields, fieldName, ''))
  return allBlankedFields.submission ?? {}
}

const Submit = ({
  versions = [],
  decisionForm,
  reviewForm,
  submissionForm,
  createNewVersion,
  currentUser,
  parent,
  onChange,
  republish,
  onSubmit,
  match,
  updateManuscript,
  createFile,
  deleteFile,
  setShouldPublishField,
  threadedDiscussionProps,
  manuscriptLatestVersionId,
  validateDoi,
  validateSuffix,
}) => {
  const config = useContext(ConfigContext)

  const allowAuthorsSubmitNewVersion =
    config?.submission?.allowAuthorsSubmitNewVersion

  const decisionSections = []

  const submissionValues = createBlankSubmissionBasedOnForm(submissionForm)

  const handleSave = (source, versionId) =>
    updateManuscript(versionId, { meta: { source } })

  const debouncedSave = useCallback(debounce(handleSave, 2000), [])
  useEffect(() => {
    debouncedSave.flush()
    return () => debouncedSave.flush()
  }, [versions.length])

  versions.forEach(({ manuscript: version, label }, index) => {
    const userCanEditManuscriptAndFormData =
      index === 0 &&
      (['new', 'revising'].includes(version.status) ||
        (currentUser.groupRoles.includes('groupManager') &&
          version.status !== 'rejected'))

    const editorSection = {
      content: (
        <EditorSection
          currentUser={currentUser}
          manuscript={version}
          readonly={!userCanEditManuscriptAndFormData}
          saveSource={source => {
            debouncedSave(source, version.id)
          }}
        />
      ),
      key: `editor`,
      label: 'Manuscript text',
    }

    let decisionSection

    const selectedManuscriptVersionId = version.id

    const threadedDiscussionExtendedProps = {
      ...threadedDiscussionProps,
      manuscriptLatestVersionId,
      selectedManuscriptVersionId,
    }

    if (userCanEditManuscriptAndFormData) {
      Object.assign(submissionValues, version.submission)

      const versionValues = {
        ...version,
        submission: submissionValues,
      }

      const submissionProps = {
        versionValues,
        form: submissionForm,
        onSubmit,
        onChange,
        republish,
        match,
        manuscript: version,
        createFile,
        deleteFile,
        setShouldPublishField,
        threadedDiscussionExtendedProps,
        validateDoi,
        validateSuffix,
      }

      decisionSection = {
        content: <SubmissionForm {...submissionProps} />,
        key: version.id,
        label: 'Edit submission info',
      }
    } else {
      decisionSection = {
        content: (
          <>
            <DecisionAndReviews
              allowAuthorsSubmitNewVersion={allowAuthorsSubmitNewVersion}
              currentUser={currentUser}
              decisionForm={decisionForm}
              manuscript={version}
              reviewForm={reviewForm}
              threadedDiscussionProps={threadedDiscussionExtendedProps}
            />
            <ReadonlyFormTemplate
              form={submissionForm}
              formData={version}
              manuscript={version}
              showEditorOnlyFields={false}
              threadedDiscussionProps={threadedDiscussionExtendedProps}
              title="Metadata"
            />
          </>
        ),
        key: version.id,
        label: 'Submitted info',
      }
    }

    decisionSections.push({
      content: (
        <>
          {['ncrc'].includes(config.instanceName) && (
            <AssignEditorsReviewers
              AssignEditor={AssignEditor}
              manuscript={version}
            />
          )}
          {index === 0 &&
            !['revising', 'new'].includes(version.status) &&
            (allowAuthorsSubmitNewVersion || version.status === 'revise') && (
              <CreateANewVersion
                allowAuthorsSubmitNewVersion={allowAuthorsSubmitNewVersion}
                createNewVersion={createNewVersion}
                manuscript={version}
              />
            )}
          <HiddenTabs
            defaultActiveKey={version.id}
            sections={[decisionSection, editorSection]}
          />
        </>
      ),
      key: version.id,
      label,
    })
  })

  // Protect if channels don't exist for whatever reason
  let channelId

  if (Array.isArray(parent.channels) && parent.channels.length) {
    channelId = parent.channels.find(c => c.type === 'all').id
  }

  return (
    <Columns>
      <Manuscript>
        <ErrorBoundary>
          <VersionSwitcher
            key={decisionSections.length}
            versions={decisionSections}
          />
        </ErrorBoundary>
      </Manuscript>
      <Chat>
        <MessageContainer channelId={channelId} currentUser={currentUser} />
      </Chat>
    </Columns>
  )
}

const formPropTypes = PropTypes.shape({
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
        PropTypes.oneOfType([
          PropTypes.string.isRequired,
          PropTypes.number.isRequired,
        ]).isRequired,
      ),
      readonly: PropTypes.bool,
    }).isRequired,
  ).isRequired,
  popuptitle: PropTypes.string,
  popupdescription: PropTypes.string,
  haspopup: PropTypes.string.isRequired, // bool as string
})

Submit.propTypes = {
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      manuscript: PropTypes.objectOf(PropTypes.any),
      label: PropTypes.string,
    }),
  ).isRequired,
  submissionForm: formPropTypes.isRequired,
  decisionForm: formPropTypes.isRequired,
  reviewForm: formPropTypes.isRequired,
  createNewVersion: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    groupRoles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
  parent: PropTypes.shape({
    channels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
    ),
  }),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  republish: PropTypes.func.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  updateManuscript: PropTypes.func.isRequired,
}
Submit.defaultProps = {
  currentUser: { groupRoles: [] },
  parent: undefined,
}

export default Submit
