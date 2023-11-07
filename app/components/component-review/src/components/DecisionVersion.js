import React, { useContext, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DecisionReviews from './decision/DecisionReviews'
import AssignEditorsReviewers from './assignEditors/AssignEditorsReviewers'
import AssignEditor from './assignEditors/AssignEditor'
import EmailNotifications from './emailNotifications'
import { FormTemplate, ReadonlyFormTemplate } from '../../../component-form/src'
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
import TaskList from '../../../component-task-manager/src/TaskList'
import KanbanBoard from './KanbanBoard'
import InviteReviewer from './reviewers/InviteReviewer'
import { ConfigContext } from '../../../config/src'
import { getActiveTab } from '../../../../shared/manuscriptUtils'

const TaskSectionRow = styled(SectionRow)`
  padding: 12px 0 18px;
`

const DecisionVersion = ({
  allUsers,
  addReviewer,
  roles,
  decisionForm,
  decisionFormComponents,
  submissionForms,
  submissionFormComponents,
  currentDecisionData,
  currentUser,
  version,
  versionNumber,
  isCurrentVersion,
  parent,
  updateManuscript, // To handle manuscript editing
  onChange, // To handle form editing
  makeDecision,
  sendNotifyEmail,
  sendChannelMessage,
  publishManuscript,
  updateTeam,
  createTeam,
  updateReview,
  reviewForm,
  reviewFormComponents,
  reviewers,
  teamLabels,
  canHideReviews,
  urlFrag,
  displayShortIdAsIdentifier,
  updateReviewJsonData,
  validateDoi,
  validateSuffix,
  createFile,
  deleteFile,
  threadedDiscussionProps,
  invitations,
  externalEmail,
  setExternalEmail,
  selectedEmail,
  setSelectedEmail,
  setShouldPublishField,
  selectedEmailIsBlacklisted,
  updateSharedStatusForInvitedReviewer,
  dois,
  refetch,
  updateTask,
  updateTasks,
  teams,
  removeReviewer,
  updateTeamMember,
  updateTaskNotification,
  deleteTaskNotification,
  createTaskEmailNotificationLog,
  manuscriptLatestVersionId,
  emailTemplates,
}) => {
  const config = useContext(ConfigContext)

  const debouncedSave = useCallback(
    debounce(source => {
      updateManuscript(version.id, { meta: { source } })
    }, 2000),
    [],
  )

  useEffect(() => debouncedSave.flush, [])
  const location = useLocation()

  const activeTab = React.useMemo(() => getActiveTab(location, 'tab'), [
    location,
  ])

  const addEditor = (manuscript, label, isCurrent, user) => {
    const isThisReadOnly = !isCurrent

    return {
      content: (
        <EditorSection
          currentUser={user}
          manuscript={manuscript}
          readonly={isThisReadOnly}
          saveSource={isThisReadOnly ? null : debouncedSave}
        />
      ),
      key: `editor`,
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
    isCurrentVersion,
    currentUser,
  )

  const submissionForm =
    submissionForms.find(
      f => f.structure.purpose === version.submission.$$formPurpose,
    ) ??
    submissionForms.find(f => f.isDefault) ??
    submissionForms[0]

  const metadataSection = () => {
    const versionId = version.id

    return {
      content: (
        <>
          {!isCurrentVersion ? (
            <ReadonlyFormTemplate
              customComponents={submissionFormComponents}
              displayShortIdAsIdentifier={displayShortIdAsIdentifier}
              form={submissionForm}
              formData={version}
              manuscript={version}
              showEditorOnlyFields
            />
          ) : (
            <SectionContent>
              <FormTemplate
                createFile={createFile}
                customComponents={submissionFormComponents}
                deleteFile={deleteFile}
                displayShortIdAsIdentifier={displayShortIdAsIdentifier}
                fieldsToPublish={
                  version.formFieldsToPublish.find(
                    ff => ff.objectId === version.id,
                  )?.fieldsToPublish ?? []
                }
                form={submissionForm}
                formData={version}
                isSubmission
                manuscriptId={version.id}
                manuscriptShortId={version.shortId}
                manuscriptStatus={version.status}
                match={{ url: 'decision' }}
                onChange={(value, path) => {
                  onChange(value, path, versionId)
                }}
                republish={() => null}
                setShouldPublishField={async (fieldName, shouldPublish) =>
                  setShouldPublishField({
                    variables: {
                      manuscriptId: version.id,
                      objectId: version.id,
                      fieldName,
                      shouldPublish,
                    },
                  })
                }
                shouldShowOptionToPublish
                showEditorOnlyFields
                validateDoi={validateDoi}
                validateSuffix={validateSuffix}
              />
            </SectionContent>
          )}
        </>
      ),
      key: `metadata`,
      label: 'Metadata',
    }
  }

  const tasksAndNotificationsSection = () => {
    return {
      content: (
        <>
          {isCurrentVersion &&
            ['aperture', 'colab'].includes(config.instanceName) && (
              <EmailNotifications
                allUsers={allUsers}
                currentUser={currentUser}
                emailTemplates={emailTemplates}
                externalEmail={externalEmail}
                manuscript={version}
                selectedEmail={selectedEmail}
                selectedEmailIsBlacklisted={selectedEmailIsBlacklisted}
                sendChannelMessage={sendChannelMessage}
                sendNotifyEmail={sendNotifyEmail}
                setExternalEmail={setExternalEmail}
                setSelectedEmail={setSelectedEmail}
              />
            )}
          <SectionContent>
            <SectionHeader>
              <Title>Tasks</Title>
            </SectionHeader>
            <TaskSectionRow>
              <TaskList
                createTaskEmailNotificationLog={createTaskEmailNotificationLog}
                currentUser={currentUser}
                deleteTaskNotification={deleteTaskNotification}
                emailTemplates={emailTemplates}
                manuscript={version}
                manuscriptId={parent.id}
                roles={roles}
                sendNotifyEmail={sendNotifyEmail}
                tasks={parent.tasks}
                updateTask={updateTask}
                updateTaskNotification={updateTaskNotification}
                updateTasks={updateTasks}
                users={allUsers}
              />
            </TaskSectionRow>
          </SectionContent>
        </>
      ),
      key: `tasks`,
      label: 'Tasks & Notifications',
    }
  }

  const teamSection = () => {
    return {
      content: (
        <>
          {isCurrentVersion && (
            <AssignEditorsReviewers
              allUsers={allUsers}
              AssignEditor={AssignEditor}
              createTeam={createTeam}
              manuscript={version}
              teamLabels={teamLabels}
              updateTeam={updateTeam}
            />
          )}
          {!isCurrentVersion && (
            <SectionContent>
              <SectionHeader>
                <Title>Assigned editors</Title>
              </SectionHeader>
              <SectionRow>
                {version?.teams?.map(team => {
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
          <KanbanBoard
            invitations={invitations}
            isCurrentVersion={isCurrentVersion}
            manuscript={version}
            removeReviewer={removeReviewer}
            reviewForm={reviewForm}
            reviewFormComponents={reviewFormComponents}
            reviews={reviewers}
            updateReview={updateReview}
            updateSharedStatusForInvitedReviewer={
              updateSharedStatusForInvitedReviewer
            }
            updateTeamMember={updateTeamMember}
            version={version}
            versionNumber={versionNumber}
          />
          {isCurrentVersion && (
            <AdminSection>
              <InviteReviewer
                addReviewer={addReviewer}
                currentUser={currentUser}
                emailTemplates={emailTemplates}
                manuscript={version}
                reviewerUsers={allUsers}
                selectedEmailIsBlacklisted={selectedEmailIsBlacklisted}
                sendChannelMessage={sendChannelMessage}
                sendNotifyEmail={sendNotifyEmail}
                setExternalEmail={setExternalEmail}
                updateSharedStatusForInvitedReviewer={
                  updateSharedStatusForInvitedReviewer
                }
                updateTeamMember={updateTeamMember}
              />
            </AdminSection>
          )}
        </>
      ),
      key: `team`,
      label: 'Team',
    }
  }

  const decisionSection = () => {
    return {
      content: (
        <>
          {!isCurrentVersion && (
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
          {!isCurrentVersion && (
            <DecisionAndReviews
              currentUser={currentUser}
              decisionForm={decisionForm}
              decisionFormComponents={decisionFormComponents}
              isControlPage
              manuscript={version}
              readOnly
              reviewForm={reviewForm}
              reviewFormComponents={reviewFormComponents}
              showEditorOnlyFields
            />
          )}
          {isCurrentVersion && (
            <DecisionReviews
              canHideReviews={canHideReviews}
              currentUser={currentUser}
              invitations={invitations}
              manuscript={version}
              reviewers={reviewers}
              reviewForm={reviewForm}
              reviewFormComponents={reviewFormComponents}
              updateReview={updateReview}
              updateSharedStatusForInvitedReviewer={
                updateSharedStatusForInvitedReviewer
              }
              updateTeamMember={updateTeamMember}
              urlFrag={urlFrag}
            />
          )}
          {isCurrentVersion && (
            <AdminSection key="decision-form">
              <SectionContent>
                <FormTemplate
                  createFile={createFile}
                  customComponents={decisionFormComponents}
                  deleteFile={deleteFile}
                  fieldsToPublish={
                    version.formFieldsToPublish.find(
                      ff => ff.objectId === currentDecisionData.id,
                    )?.fieldsToPublish ?? []
                  }
                  form={decisionForm}
                  formData={currentDecisionData?.jsonData}
                  isSubmission={false}
                  manuscriptId={version.id}
                  manuscriptShortId={version.shortId}
                  manuscriptStatus={version.status}
                  onChange={updateReviewJsonData}
                  onSubmit={async (values, actions) => {
                    await makeDecision({
                      variables: {
                        id: version.id,
                        decision: values.$verdict,
                      },
                    })
                    actions.setSubmitting(false)
                  }}
                  reviewId={currentDecisionData.id}
                  setShouldPublishField={async (fieldName, shouldPublish) =>
                    setShouldPublishField({
                      variables: {
                        manuscriptId: version.id,
                        objectId: currentDecisionData.id,
                        fieldName,
                        shouldPublish,
                      },
                    })
                  }
                  shouldShowOptionToPublish
                  shouldStoreFilesInForm
                  showEditorOnlyFields
                  submissionButtonText="Submit"
                  tagForFiles="decision"
                  validateDoi={validateDoi}
                  validateSuffix={validateSuffix}
                />
              </SectionContent>
            </AdminSection>
          )}
          {isCurrentVersion && (
            <AdminSection>
              <Publish
                dois={dois}
                manuscript={version}
                publishManuscript={publishManuscript}
              />
            </AdminSection>
          )}
        </>
      ),
      key: `decision`,
      label: 'Decision',
    }
  }

  let defaultActiveKey

  switch (config?.controlPanel?.showTabs[0]) {
    case 'Team':
      defaultActiveKey = `team`
      break
    case 'Decision':
      defaultActiveKey = `decision`
      break
    case 'Manuscript text':
      defaultActiveKey = `editor`
      break
    case 'Metadata':
      defaultActiveKey = `metadata`
      break
    case 'Tasks & Notifications':
      defaultActiveKey = `tasks`
      break
    default:
      defaultActiveKey = `team`
      break
  }

  let locationState =
    location.state !== undefined && location.state.tab === 'Decision'
      ? `decision`
      : defaultActiveKey

  if (activeTab) locationState = activeTab

  const sections = []

  if (config?.controlPanel?.showTabs) {
    if (config?.controlPanel?.showTabs.includes('Team'))
      sections.push(teamSection())
    if (config?.controlPanel?.showTabs.includes('Decision'))
      sections.push(decisionSection())
    if (config?.controlPanel?.showTabs.includes('Manuscript text'))
      sections.push(editorSection)
    if (config?.controlPanel?.showTabs.includes('Metadata'))
      sections.push(metadataSection())
    if (config?.controlPanel?.showTabs.includes('Tasks & Notifications'))
      sections.push(tasksAndNotificationsSection())
  }

  return (
    <HiddenTabs
      defaultActiveKey={locationState}
      onChange={refetch}
      sections={sections}
    />
  )
}

DecisionVersion.propTypes = {
  addReviewer: PropTypes.func.isRequired,
  updateManuscript: PropTypes.func.isRequired,
  submissionForms: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      structure: PropTypes.shape({
        purpose: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
            title: PropTypes.string,
            shortDescription: PropTypes.string,
          }).isRequired,
        ).isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  isCurrentVersion: PropTypes.bool.isRequired,
  version: PropTypes.shape({
    id: PropTypes.string.isRequired,
    meta: PropTypes.shape({ source: PropTypes.string }).isRequired,
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
  versionNumber: PropTypes.number.isRequired,
  parent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(
          PropTypes.shape({
            user: PropTypes.shape({
              id: PropTypes.string.isRequired,
              username: PropTypes.string.isRequired,
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
