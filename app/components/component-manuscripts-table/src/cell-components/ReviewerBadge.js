import React from 'react'
import { ConfigurableStatus } from '../../../shared'
import reviewStatuses from '../../../../../config/journal/review-status'
import { getMembersOfTeam } from '../../../../shared/manuscriptUtils'

const ReviewerBadge = ({ manuscript, currentUser }) => {
  const members = getMembersOfTeam(manuscript, 'reviewer')

  const status = members?.find(member => member.user.id === currentUser.id)
    ?.status

  // get item in list with value === status
  const statusConfig = reviewStatuses.find(item => item.value === status)

  return (
    <ConfigurableStatus
      color={statusConfig.color}
      lightText={statusConfig.lightText}
    >
      {statusConfig.label}
    </ConfigurableStatus>
  )
}

export default ReviewerBadge
