import { Formik } from 'formik'
import React, { useState } from 'react'
import {
  SectionContent,
  SectionHeader,
  SectionRow,
  Title,
} from '../../../../shared'
import InviteReviewerModal from './InviteReviewerModal'
import ReviewerForm from './ReviewerForm'

const InviteReviewer = ({
  reviewerUsers,
  manuscript,
  addReviewer,
  updateSharedStatusForInvitedReviewer,
  currentUser,
  sendNotifyEmail,
  sendChannelMessageCb,
  selectedEmail,
  isEmailAddressOptedOut,
  setExternalEmail,
  externalEmail,
  updateTeamMember,
  setSelectedEmail,
}) => {
  const [open, setOpen] = useState(false)

  const [userId, setUserId] = useState(undefined)

  const [isNewUser, setIsNewUser] = useState(false)
  const [optedOut, setOptedOut] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState(null)

  const [externalName, setExternalName] = useState('')

  return (
    <>
      <Formik
        displayName="reviewers"
        initialValues={{ user: undefined, email: undefined, name: undefined }}
        onSubmit={async values => {
          setOptedOut(false)

          if (isNewUser) {
            if (isEmailAddressOptedOut?.data?.getBlacklistInformation.length) {
              setOptedOut(true)
              setNotificationStatus('failure')
              return
            }

            setNotificationStatus('success')
            setExternalName(values.name)
          } else {
            setUserId(values.user.id)
            setSelectedEmail(values.user.email)
          }

          setOpen(true)
        }}
      >
        {formikProps => (
          <>
            <SectionContent>
              <SectionHeader>
                <Title>Invite Reviewers</Title>
              </SectionHeader>
              <SectionRow>
                <ReviewerForm
                  {...formikProps}
                  isNewUser={isNewUser}
                  notificationStatus={notificationStatus}
                  optedOut={optedOut}
                  reviewerUsers={reviewerUsers}
                  setExternalEmail={setExternalEmail}
                  setIsNewUser={setIsNewUser}
                />
              </SectionRow>
            </SectionContent>
          </>
        )}
      </Formik>
      <InviteReviewerModal
        addReviewer={addReviewer}
        currentUser={currentUser}
        externalEmail={externalEmail}
        externalName={externalName}
        isEmailAddressOptedOut={isEmailAddressOptedOut}
        isNewUser={isNewUser}
        manuscript={manuscript}
        onClose={() => setOpen(false)}
        open={open}
        reviewerUsers={reviewerUsers}
        selectedEmail={selectedEmail}
        sendChannelMessageCb={sendChannelMessageCb}
        sendNotifyEmail={sendNotifyEmail}
        updateSharedStatusForInvitedReviewer={
          updateSharedStatusForInvitedReviewer
        }
        updateTeamMember={updateTeamMember}
        userId={userId}
      />
    </>
  )
}

export default InviteReviewer
