import React, { useState } from 'react'
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

const DecisionVersions = ({
  allUsers,
  currentUser,
  decisionForm,
  form,
  handleChange,
  updateManuscript,
  manuscript,
  sendNotifyEmail,
  sendChannelMessageCb,
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
  threadedDiscussions,
  updatePendingComment,
  completeComments,
  completeComment,
  deletePendingComment,
  validateDoi,
  invitations,
  setExternalEmail,
  externalEmail,
  selectedEmail,
  setSelectedEmail,
  isEmailAddressOptedOut,
}) => {
  const [initialValue, setInitialValue] = useState(null)

  const versions = gatherManuscriptVersions(manuscript)

  if (!initialValue)
    setInitialValue(
      versions[0].manuscript.reviews.find(r => r.isDecision) || {
        id: uuid(),
        isDecision: true,
        userId: currentUser.id,
      },
    )

  // Protect if channels don't exist for whatever reason
  let editorialChannelId, allChannelId

  if (Array.isArray(manuscript.channels) && manuscript.channels.length) {
    editorialChannelId = manuscript.channels.find(c => c.type === 'editorial')
      .id
    allChannelId = manuscript.channels.find(c => c.type === 'all').id
  }

  const channels = [
    { id: allChannelId, name: 'Discussion with author' },
    { id: editorialChannelId, name: 'Editorial discussion' },
  ]

  return (
    <Columns>
      <Manuscript>
        <ErrorBoundary>
          <VersionSwitcher>
            {versions.map((version, index) => (
              <DecisionVersion
                allUsers={allUsers}
                canHideReviews={canHideReviews}
                completeComment={completeComment}
                completeComments={completeComments}
                createFile={createFile}
                createTeam={createTeam}
                current={index === 0}
                currentDecisionData={initialValue}
                currentUser={currentUser}
                decisionForm={decisionForm}
                deleteFile={deleteFile}
                deletePendingComment={deletePendingComment}
                displayShortIdAsIdentifier={displayShortIdAsIdentifier}
                externalEmail={externalEmail}
                form={form}
                invitations={invitations}
                isEmailAddressOptedOut={isEmailAddressOptedOut}
                key={version.manuscript.id}
                makeDecision={makeDecision}
                onChange={handleChange}
                parent={manuscript}
                publishManuscript={publishManuscript}
                reviewers={reviewers}
                reviewForm={reviewForm}
                selectedEmail={selectedEmail}
                sendChannelMessageCb={sendChannelMessageCb}
                sendNotifyEmail={sendNotifyEmail}
                setExternalEmail={setExternalEmail}
                setSelectedEmail={setSelectedEmail}
                teamLabels={teamLabels}
                threadedDiscussions={threadedDiscussions}
                updateManuscript={updateManuscript}
                updatePendingComment={updatePendingComment}
                updateReview={updateReview}
                updateReviewJsonData={(value, path) =>
                  updateReviewJsonData(initialValue.id, value, path)
                }
                updateTeam={updateTeam}
                urlFrag={urlFrag}
                validateDoi={validateDoi}
                version={version.manuscript}
              />
            ))}
          </VersionSwitcher>
        </ErrorBoundary>
      </Manuscript>
      <Chat>
        <MessageContainer channels={channels} manuscriptId={manuscript.id} />
      </Chat>
    </Columns>
  )
}

export default DecisionVersions
