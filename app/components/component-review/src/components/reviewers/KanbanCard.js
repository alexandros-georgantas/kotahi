import { grid, th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'
import React, { useState } from 'react'
import { Mail } from 'react-feather'
import styled from 'styled-components'
import { convertTimestampToRelativeDateString } from '../../../../../shared/dateUtils'
import { UserAvatar } from '../../../../component-avatar/src'
import ReviewDetailsModal from '../../../../component-review-detail-modal/src'

const Card = styled.div`
  align-items: center;
  background-color: #f8f8f9;
  border-bottom: 0.8px solid #bfbfbf;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  font-size: ${th('fontSizeBaseSmall')};
  padding: ${grid(1)};
  position: relative;
  width: 100%;

  &:hover {
    box-shadow: 0px 9px 5px -6px #bfbfbf;
    cursor: pointer;
    transition: 0.3s ease;
    z-index: 1;
  }
`

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${grid(1)};
  min-width: 0;
`

const NameDisplay = styled.div`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DateDisplay = styled.div`
  color: gray;
  font-size: 13px;
  line-height: 1.2;
`

const MailIcon = styled(Mail)`
  color: ${th('colorPrimary')};
  height: 14px;
  margin-right: calc(${th('gridUnit')} / 2);
  width: auto;
`

const NameWithIconRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
`

const KanbanCard = ({
  reviewer,
  isInvitation,
  manuscript,
  removeReviewer,
  status,
  reviewForm,
  review,
  isCurrentVersion,
  updateSharedStatusForInvitedReviewer,
  updateTeamMember,
  updateReview,
  showEmailInvitation,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ReviewDetailsModal
        isInvitation={isInvitation}
        isOpen={open}
        manuscriptId={manuscript.id}
        onClose={() => setOpen(false)}
        readOnly={!isCurrentVersion}
        removeReviewer={removeReviewer}
        review={review}
        reviewerTeamMember={reviewer}
        reviewForm={reviewForm}
        status={status}
        updateReview={updateReview}
        updateSharedStatusForInvitedReviewer={
          updateSharedStatusForInvitedReviewer
        }
        updateTeamMember={updateTeamMember}
      />
      <Card onClick={() => setOpen(true)}>
        <UserAvatar
          isClickable={!!reviewer.user}
          showHoverProfile={false}
          user={
            reviewer.user ?? {
              username: reviewer.invitedPersonName,
              isOnline: false,
            }
          }
        />
        <InfoGrid>
          <NameWithIconRow>
            <NameDisplay>
              {reviewer.user?.username ?? reviewer.invitedPersonName}
            </NameDisplay>
            {showEmailInvitation && (
              <Tooltip
                overlay={<p>Invited via Email</p>}
                overlayInnerStyle={{
                  backgroundColor: 'LightGray',
                  borderColor: 'LightGray',
                  padding: '4px 10px',
                  minHeight: 'unset',
                  opacity: 1,
                }}
                overlayStyle={{
                  backgroundColor: 'transparent',
                }}
                placement="top"
              >
                <MailIcon />
              </Tooltip>
            )}
          </NameWithIconRow>
          <DateDisplay>
            Last updated
            {` ${convertTimestampToRelativeDateString(reviewer.updated)}`}
          </DateDisplay>
        </InfoGrid>
      </Card>
    </>
  )
}

KanbanCard.propTypes = {
  reviewer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      defaultIdentity: PropTypes.shape({
        identifier: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  isInvitation: PropTypes.bool.isRequired,
}

export default KanbanCard
