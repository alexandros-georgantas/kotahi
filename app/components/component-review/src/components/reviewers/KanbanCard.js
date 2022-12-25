import { grid, th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import React from 'react'
import { Mail } from 'react-feather'
import styled from 'styled-components'
import { convertTimestampToRelativeDateString } from '../../../../../shared/dateUtils'
import { UserAvatar } from '../../../../component-avatar/src'

const Card = styled.div`
  background-color: #f8f8f9;
  border-bottom: 0.8px solid #bfbfbf;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  font-size: ${th('fontSizeBaseSmall')};
  justify-content: space-between;
  padding: ${grid(1)};
  position: relative;
  width: 100%;

  &:hover {
    box-shadow: 0px 9px 5px -6px #bfbfbf;
    transition: 0.3s ease;
    z-index: 1;
  }
`

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${grid(1)};
`

const NameDisplay = styled.div`
  font-weight: bold;
`

const DateDisplay = styled.div`
  color: gray;
  font-size: 12px;
  line-height: 1.2;
`

const LeftSide = styled.div`
  align-items: center;
  display: flex;
`

const EmailDisplay = styled(DateDisplay)`
  align-items: center;
  color: ${props =>
    props.invitationStatus === 'rejected'
      ? th('colorError')
      : th('colorPrimary')};
  display: flex;
  margin-top: calc(${th('gridUnit')} / 2);
`

const MailIcon = styled(Mail)`
  height: 12px;
  margin-right: calc(${th('gridUnit')} / 2);
  width: auto;
`

const KanbanCard = ({ reviewer, showEmailInvitation, onClickAction }) => {
  return (
    <Card onClick={onClickAction}>
      <LeftSide>
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
          <NameDisplay>
            {reviewer.user?.username ?? reviewer.invitedPersonName}
          </NameDisplay>
          <DateDisplay>
            Last updated
            {` ${convertTimestampToRelativeDateString(reviewer.updated)}`}
          </DateDisplay>
          {showEmailInvitation && (
            <EmailDisplay>
              <MailIcon invitationStatus={reviewer.status.toLowerCase()} />
              {' Invited via email'}
            </EmailDisplay>
          )}
        </InfoGrid>
      </LeftSide>
    </Card>
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
  onClickAction: PropTypes.func.isRequired,
  showEmailInvitation: PropTypes.bool.isRequired,
}

export default KanbanCard
