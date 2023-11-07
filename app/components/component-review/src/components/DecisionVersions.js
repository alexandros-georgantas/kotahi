import React, { useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import DecisionVersion from './DecisionVersion'
import gatherManuscriptVersions from '../../../../shared/manuscript_versions'

import {
  VersionSwitcher,
  ErrorBoundary,
  Columns,
  Manuscript,
  Chat,
} from '../../../shared'
import MessageContainer from '../../../component-chat/src/MessageContainer'
import { getComponentsForManuscriptVersions } from '../../../component-form/src'

const DecisionVersions = ({
  allUsers,
  addReviewer,
  roles,
  currentUser,
  decisionForm,
  submissionForms,
  handleChange,
  updateManuscript,
  manuscript,
  sendNotifyEmail,
  sendChannelMessage,
  makeDecision,
  updateReviewJsonData,
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
  deleteFile,
  createFile,
  threadedDiscussionProps,
  validateDoi,
  validateSuffix,
  setExternalEmail,
  externalEmail,
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
  updateTeamMember,
  removeReviewer,
  updateTaskNotification,
  deleteTaskNotification,
  createTaskEmailNotificationLog,
  emailTemplates,
}) => {
  const versions = gatherManuscriptVersions(manuscript)
  const firstVersion = versions[versions.length - 1]

  const initialValue = useMemo(
    () =>
      versions[0].manuscript.reviews.find(r => r.isDecision) || {
        id: uuid(),
        isDecision: true,
        userId: currentUser.id,
      },
    [],
  )

  // Protect if channels don't exist for whatever reason
  let editorialChannel, allChannel

  if (Array.isArray(manuscript.channels) && manuscript.channels.length) {
    editorialChannel = manuscript.channels.find(c => c.type === 'editorial')
    allChannel = manuscript.channels.find(c => c.type === 'all')
  }

  const channels = [
    {
      id: allChannel?.id,
      name: 'Discussion with author',
      type: allChannel?.type,
    },
    {
      id: editorialChannel?.id,
      name: 'Editorial discussion',
      type: editorialChannel?.type,
    },
  ]

  const componentsMap = getComponentsForManuscriptVersions(
    versions,
    threadedDiscussionProps,
    true,
  )

  return (
    <Columns>
      <Manuscript>
        <ErrorBoundary>
          <VersionSwitcher>
            {versions.map((version, index) => (
              <DecisionVersion
                addReviewer={addReviewer}
                allUsers={allUsers}
                canHideReviews={canHideReviews}
                createFile={createFile}
                createTaskEmailNotificationLog={createTaskEmailNotificationLog}
                createTeam={createTeam}
                currentDecisionData={initialValue}
                currentUser={currentUser}
                decisionForm={decisionForm}
                decisionFormComponents={componentsMap[version.manuscript.id]}
                deleteFile={deleteFile}
                deleteTaskNotification={deleteTaskNotification}
                displayShortIdAsIdentifier={displayShortIdAsIdentifier}
                dois={dois}
                emailTemplates={emailTemplates}
                externalEmail={externalEmail}
                invitations={version.manuscript.invitations || []}
                isCurrentVersion={index === 0}
                key={version.manuscript.id}
                makeDecision={makeDecision}
                onChange={handleChange}
                parent={firstVersion.manuscript}
                publishManuscript={publishManuscript}
                refetch={refetch}
                removeReviewer={removeReviewer}
                reviewers={reviewers}
                reviewForm={reviewForm}
                reviewFormComponents={componentsMap[version.manuscript.id]}
                roles={roles}
                selectedEmail={selectedEmail}
                selectedEmailIsBlacklisted={selectedEmailIsBlacklisted}
                sendChannelMessage={sendChannelMessage}
                sendNotifyEmail={sendNotifyEmail}
                setExternalEmail={setExternalEmail}
                setSelectedEmail={setSelectedEmail}
                setShouldPublishField={setShouldPublishField}
                submissionFormComponents={componentsMap[version.manuscript.id]}
                submissionForms={submissionForms}
                teamLabels={teamLabels}
                updateManuscript={updateManuscript}
                updateReview={updateReview}
                updateReviewJsonData={(value, path) =>
                  updateReviewJsonData(
                    initialValue.id,
                    value,
                    path,
                    version.manuscript.id,
                  )
                }
                updateSharedStatusForInvitedReviewer={
                  updateSharedStatusForInvitedReviewer
                }
                updateTask={updateTask}
                updateTaskNotification={updateTaskNotification}
                updateTasks={updateTasks}
                updateTeam={updateTeam}
                updateTeamMember={updateTeamMember}
                urlFrag={urlFrag}
                validateDoi={validateDoi}
                validateSuffix={validateSuffix}
                version={version.manuscript}
                versionNumber={versions.length - index}
              />
            ))}
          </VersionSwitcher>
        </ErrorBoundary>
      </Manuscript>
      <Chat>
        <MessageContainer
          channels={channels}
          currentUser={currentUser}
          manuscriptId={manuscript.id}
        />
      </Chat>
    </Columns>
  )
}

export default DecisionVersions
