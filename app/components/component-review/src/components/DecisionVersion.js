import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { set, debounce } from 'lodash'
import DecisionReviews from './decision/DecisionReviews'
import AssignEditorsReviewers from './assignEditors/AssignEditorsReviewers'
import AssignEditor from './assignEditors/AssignEditor'
import EmailNotifications from './emailNotifications'
import ReadonlyFormTemplate from './metadata/ReadonlyFormTemplate'
import EditorSection from './decision/EditorSection'
import Publish from './Publish'
import { AdminSection } from './style'
import {
  HiddenTabs,
  SectionContent,
  SectionHeader,
  SectionRow,
  Title,
} from '../../../shared'
import DecisionAndReviews from '../../../component-submit/src/components/DecisionAndReviews'
import FormTemplate from '../../../component-submit/src/components/FormTemplate'

const createBlankSubmissionBasedOnForm = form => {
  const allBlankedFields = {}
  const fieldNames = form?.children?.map(field => field.name)
  fieldNames.forEach(fieldName => set(allBlankedFields, fieldName, ''))
  return allBlankedFields.submission ?? {}
}

const DecisionVersion = ({
  allUsers,
  decisionForm,
  form,
  current,
  currentDecisionData,
  currentUser,
  version,
  parent,
  updateManuscript, // To handle manuscript editing
  onChange, // To handle form editing
  makeDecision,
  sendNotifyEmail,
  sendChannelMessageCb,
  publishManuscript,
  updateTeam,
  createTeam,
  updateReview,
  reviewForm,
  reviewers,
  teamLabels,
  canHideReviews,
  urlFrag,
  displayShortIdAsIdentifier,
  updateReviewJsonData,
  validateDoi,
  createFile,
  deleteFile,
}) => {
  // Hooks from the old world
  const addEditor = (manuscript, label, isCurrent, user) => {
    const isThisReadOnly = !isCurrent

    const handleSave = useCallback(
      debounce(source => {
        updateManuscript(manuscript.id, { meta: { source } })
      }, 2000),
    )

    return {
      content: (
        <EditorSection
          currentUser={user}
          manuscript={manuscript}
          readonly={isThisReadOnly}
          saveSource={isThisReadOnly ? null : handleSave}
        />
      ),
      key: `editor_${manuscript.id}`,
      label,
    }
  }

  const reviewOrInitial = manuscript =>
    manuscript?.reviews?.find(review => review.isDecision) || {
      isDecision: true,
    }

  // Find an existing review or create a placeholder, and hold a ref to it
  const existingReview = useRef(reviewOrInitial(version))

  // Update the value of that ref if the manuscript object changes
  useEffect(() => {
    existingReview.current = reviewOrInitial(version)
  }, [version.reviews])

  const editorSection = addEditor(
    version,
    'Manuscript text',
    current,
    currentUser,
  )

  const metadataSection = () => {
    const submissionValues = current
      ? createBlankSubmissionBasedOnForm(form)
      : {}

    Object.assign(submissionValues, JSON.parse(version.submission))

    const versionValues = {
      ...version,
      submission: submissionValues,
    }

    const versionId = version.id

    return {
      content: (
        <>
          {!current ? (
            <ReadonlyFormTemplate
              displayShortIdAsIdentifier={displayShortIdAsIdentifier}
              form={form}
              formData={{
                ...version,
                submission: JSON.parse(version.submission),
              }}
              listManuscriptFiles
              manuscript={version}
              showEditorOnlyFields
            />
          ) : (
            <SectionContent>
              <FormTemplate
                createFile={createFile}
                deleteFile={deleteFile}
                displayShortIdAsIdentifier={displayShortIdAsIdentifier}
                form={form}
                initialValues={versionValues}
                isSubmission
                manuscriptId={version.id}
                manuscriptShortId={version.shortId}
                manuscriptStatus={version.status}
                match={{ url: 'decision' }}
                onChange={(value, path) => {
                  onChange(value, path, versionId)
                }}
                republish={() => null}
                showEditorOnlyFields
                urlFrag={urlFrag}
                validateDoi={validateDoi}
              />
            </SectionContent>
          )}
        </>
      ),
      key: `metadata_${version.id}`,
      label: 'Metadata',
    }
  }

  const decisionSection = () => {
    return {
      content: (
        <>
          {!current && (
            <SectionContent>
              <SectionHeader>
                <Title>Archived version</Title>
              </SectionHeader>
              <SectionRow>
                This is not the current, but an archived read-only version of
                the manuscript.
              </SectionRow>
            </SectionContent>
          )}
          {current && (
            <>
              {['aperture', 'colab'].includes(process.env.INSTANCE_NAME) && (
                <EmailNotifications
                  allUsers={allUsers}
                  currentUser={currentUser}
                  manuscript={version}
                  sendChannelMessageCb={sendChannelMessageCb}
                  sendNotifyEmail={sendNotifyEmail}
                />
              )}
              <AssignEditorsReviewers
                allUsers={allUsers}
                AssignEditor={AssignEditor}
                createTeam={createTeam}
                manuscript={parent}
                teamLabels={teamLabels}
                updateTeam={updateTeam}
              />
            </>
          )}
          {!current && (
            <SectionContent>
              <SectionHeader>
                <Title>Assigned editors</Title>
              </SectionHeader>
              <SectionRow>
                {parent?.teams?.map(team => {
                  if (
                    ['seniorEditor', 'handlingEditor', 'editor'].includes(
                      team.role,
                    )
                  ) {
                    return (
                      <p key={team.id}>
                        {teamLabels[team.role].name}:{' '}
                        {team.members?.[0]?.user?.username}
                      </p>
                    )
                  }

                  return null
                })}
              </SectionRow>
            </SectionContent>
          )}
          {!current && (
            <DecisionAndReviews
              decisionForm={decisionForm}
              isControlPage
              manuscript={version}
              reviewForm={reviewForm}
            />
          )}
          {current && (
            <AdminSection key="decision-review">
              <DecisionReviews
                canHideReviews={canHideReviews}
                manuscript={version}
                reviewers={reviewers}
                reviewForm={reviewForm}
                updateReview={updateReview}
                urlFrag={urlFrag}
              />
            </AdminSection>
          )}
          {current && (
            <AdminSection key="decision-form">
              <SectionContent>
                <FormTemplate
                  createFile={createFile}
                  deleteFile={deleteFile}
                  form={decisionForm}
                  initialValues={
                    currentDecisionData?.jsonData
                      ? JSON.parse(currentDecisionData?.jsonData)
                      : {}
                  }
                  isSubmission={false}
                  manuscriptId={version.id}
                  manuscriptShortId={version.shortId}
                  manuscriptStatus={version.status}
                  onChange={updateReviewJsonData}
                  onSubmit={async (values, actions) => {
                    await makeDecision({
                      variables: {
                        id: version.id,
                        decision: values.verdict,
                      },
                    })
                    actions.setSubmitting(false)
                  }}
                  reviewId={currentDecisionData.id}
                  shouldStoreFilesInForm
                  showEditorOnlyFields
                  submissionButtonText="Submit"
                  tagForFiles="decision"
                  urlFrag={urlFrag}
                  validateDoi={validateDoi}
                />
              </SectionContent>
            </AdminSection>
          )}
          {current && (
            <AdminSection>
              <Publish
                manuscript={version}
                publishManuscript={publishManuscript}
              />
            </AdminSection>
          )}
        </>
      ),
      key: version.id,
      label: 'Workflow',
    }
  }

  return (
    <HiddenTabs
      defaultActiveKey={version.id}
      sections={[decisionSection(), editorSection, metadataSection()]}
    />
  )
}

DecisionVersion.propTypes = {
  updateManuscript: PropTypes.func.isRequired,
  form: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        title: PropTypes.string,
        shortDescription: PropTypes.string,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  current: PropTypes.bool.isRequired,
  version: PropTypes.shape({
    id: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      notes: PropTypes.arrayOf(
        PropTypes.shape({
          notesType: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        storedObjects: PropTypes.arrayOf(PropTypes.object.isRequired),
      }).isRequired,
    ).isRequired,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        isDecision: PropTypes.bool.isRequired,
        decisionComment: PropTypes.shape({
          content: PropTypes.string,
        }),
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          defaultIdentity: PropTypes.shape({
            identifier: PropTypes.string.isRequired,
          }),
        }).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  parent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(
          PropTypes.shape({
            user: PropTypes.shape({
              id: PropTypes.string.isRequired,
              defaultIdentity: PropTypes.shape({
                name: PropTypes.string.isRequired,
              }),
            }),
          }).isRequired,
        ),
        role: PropTypes.string.isRequired,
      }).isRequired,
    ),
  }).isRequired,
}

export default DecisionVersion
