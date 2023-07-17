import React from 'react'
import { useHistory } from 'react-router-dom'
import { Action, ActionGroup } from '@pubsweet/ui'
import styled from 'styled-components'
import { color } from '../../../../theme'

const Divider = styled.div`
  background-image: linear-gradient(${color.brand2.base}, ${color.brand2.base});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1px 100%;
`

const ReviewerItemLinks = ({
  manuscript,
  urlFrag,
  reviewerRespond,
  currentUser,
  updateReviewerStatus,
  getMainActionLink,
}) => {
  const team =
    (manuscript.teams || []).find(team_ => team_.role === 'reviewer') || {}

  const currentMember =
    team.members &&
    team.members.find(member => member.user.id === currentUser.id)

  const status = currentMember && currentMember.status

  const history = useHistory()

  const mainActionLink = getMainActionLink && getMainActionLink(manuscript)

  const reviewLinkText = {
    completed: 'Completed',
    accepted: 'Do Review',
    inProgress: 'Continue Review',
  }

  if (['accepted', 'completed', 'inProgress'].includes(status)) {
    return (
      <ActionGroup>
        <Action
          onClick={async e => {
            e.stopPropagation()
            // on click, update review status before forwarding to link

            if (status === 'accepted') {
              await updateReviewerStatus({
                variables: {
                  manuscriptId: manuscript.id,
                  status: 'inProgress',
                },
              })
            }

            history.push(mainActionLink)
          }}
        >
          {reviewLinkText[status]}
        </Action>
      </ActionGroup>
    )
  }

  if (status === 'invited') {
    return (
      <ActionGroup>
        <Action
          data-testid="accept-review"
          onClick={e => {
            e.stopPropagation()
            reviewerRespond({
              variables: {
                currentUserId: currentUser.id,
                action: 'accepted',
                teamId: team.id,
              },
            })
          }}
        >
          Accept
        </Action>
        <Divider>&nbsp;</Divider>
        <Action
          data-testid="reject-review"
          onClick={e => {
            e.stopPropagation()
            reviewerRespond({
              variables: {
                currentUserId: currentUser.id,
                action: 'rejected',
                teamId: team.id,
              },
            })
          }}
        >
          Reject
        </Action>
      </ActionGroup>
    )
  }

  return (
    <ActionGroup>
      <Action disabled>{status}</Action>
    </ActionGroup>
  )
}

export default ReviewerItemLinks
