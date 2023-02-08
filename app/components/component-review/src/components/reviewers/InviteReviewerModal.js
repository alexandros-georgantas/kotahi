import { grid, th } from '@pubsweet/ui-toolkit'
import { Checkbox } from '@pubsweet/ui/dist/atoms'
import React, { useState } from 'react'
import styled from 'styled-components'
import { UserAvatar } from '../../../../component-avatar/src'
import Modal from '../../../../component-modal/src/Modal'
import {
  ActionButton,
  LooseColumn,
  MediumRow,
  Primary,
  Secondary,
} from '../../../../shared'
import {
  sendEmail,
  sendEmailChannelMessage,
} from '../emailNotifications/emailUtils'

const ModalContainer = styled(LooseColumn)`
  background-color: ${th('colorBackground')};
  padding: ${grid(2)} ${grid(2.5)};
  z-index: 10000;
`

const UserId = styled.div`
  display: flex;
  flex-flow: column nowrap;
`

const StyledInfo = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: min-content max-content;
`

const StyledCheckbox = styled.div`
  grid-column: 2 / 3;
`

const InviteReviewerModal = ({
  open,
  onClose,
  userId,
  reviewerUsers,
  addReviewer,
  manuscript,
  sendChannelMessageCb,
  sendNotifyEmail,
  currentUser,
  updateSharedStatusForInvitedReviewer,
  updateTeamMember,
  isNewUser,
  externalName,
  externalEmail,
  isEmailAddressOptedOut,
}) => {
  const [shared, setShared] = useState(false)
  const [sendEmailNotification, setSendEmailNotification] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const identity = reviewerUsers.find(user => user.id === userId)

  const toggleSharedStatus = async (isInvitation, reviewerTeamMember) => {
    if (isInvitation) {
      await updateSharedStatusForInvitedReviewer({
        variables: {
          invitationId: reviewerTeamMember.id,
          isShared: !reviewerTeamMember.isShared,
        },
      })
    } else {
      await updateTeamMember({
        variables: {
          id: reviewerTeamMember.id,
          input: JSON.stringify({ isShared: !reviewerTeamMember.isShared }),
        },
      })
    }
  }

  const userOptedOut = !!isEmailAddressOptedOut?.data?.getBlacklistInformation
    .length

  const isInvitation = isNewUser || (!userOptedOut && sendEmailNotification)

  return (
    <Modal isOpen={open} onClose={onClose} title="Invite Reviewer">
      <ModalContainer>
        <StyledInfo>
          <UserAvatar isClickable size={48} user={!isNewUser && identity} />
          <UserId>
            <Primary>{isNewUser ? externalName : identity?.username}</Primary>
            <Secondary>
              {isNewUser
                ? externalEmail
                : identity?.defaultIdentity?.identifier}
            </Secondary>
          </UserId>
          <StyledCheckbox>
            <Checkbox
              checked={shared}
              label="Shared"
              onChange={() => setShared(v => !v)}
            />
            <Checkbox
              checked={isInvitation}
              disabled={isNewUser || userOptedOut}
              label="Email Notification"
              onChange={() => setSendEmailNotification(v => !v)}
            />
          </StyledCheckbox>
        </StyledInfo>
        {userOptedOut && <div>User email address opted out</div>}
        <MediumRow>
          <ActionButton onClick={onClose}>Cancel</ActionButton>
          &nbsp;
          <ActionButton
            data-test-id="submit-modal"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true)
              let teamMember

              if (isInvitation) {
                const response = await sendEmail(
                  manuscript,
                  isNewUser,
                  currentUser,
                  sendNotifyEmail,
                  'reviewerInvitationEmailTemplate',
                  identity?.email,
                  () => {},
                  externalEmail,
                  externalName,
                  isEmailAddressOptedOut,
                )

                if (!response) return

                if (response.input) {
                  sendEmailChannelMessage(
                    sendChannelMessageCb,
                    currentUser,
                    response.input,
                    reviewerUsers.map(reviewer => ({
                      userName: reviewer.username,
                      value: reviewer.email,
                    })),
                  )
                }

                teamMember = response.invitation
              } else {
                const { data } = await addReviewer({
                  variables: {
                    userId: identity.id,
                    manuscriptId: manuscript.id,
                  },
                })

                teamMember = data.addReviewer.members.find(
                  member => member.user.id === identity.id,
                )
              }

              if (shared) {
                toggleSharedStatus(isInvitation, {
                  id: teamMember.id,
                  isShared: false,
                })
              }

              onClose()
              setSubmitting(false)
            }}
            primary
          >
            Invite
          </ActionButton>
        </MediumRow>
      </ModalContainer>
    </Modal>
  )
}

export default InviteReviewerModal
