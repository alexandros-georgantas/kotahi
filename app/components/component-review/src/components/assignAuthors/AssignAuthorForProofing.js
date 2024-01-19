import React, { useState } from 'react'
import {
  AssignedAuthorForProofingLogsContainer,
  AssignedAuthorForProofingLogsToggle,
  AssignedAuthorForProofingLogs,
  AssignedAuthorForProofingInfo,
  SectionHeader,
  SectionRowGrid,
  Title,
} from '../style'
import { ActionButton, SectionContent } from '../../../../shared'
import { convertTimestampToDateTimeString } from '../../../../../shared/dateUtils'

const AssignAuthorForProofing = ({ assignAuthorForProofing, manuscript }) => {
  const [isToggled, setToggled] = useState(false)

  const isAuthorProofingEnabled = ['assigned', 'inProgress'].includes(
    manuscript.status,
  )

  const [submitAuthorProofingStatus, setSubmitAuthorProofingStatus] = useState(
    null,
  )

  const authorTeam = manuscript.teams.find(team => team.role === 'author')

  return (
    <SectionContent>
      <SectionHeader>
        <Title>Assign Author for Proofing </Title>
      </SectionHeader>
      <SectionRowGrid>
        <ActionButton
          dataTestid="submit-author-proofing"
          disabled={authorTeam?.members.length === 0 || isAuthorProofingEnabled}
          onClick={async () => {
            setSubmitAuthorProofingStatus('pending')

            await assignAuthorForProofing({
              variables: {
                id: manuscript?.id,
              },
            })

            setSubmitAuthorProofingStatus('success')
          }}
          primary
          status={submitAuthorProofingStatus}
        >
          Submit for author proofing
        </ActionButton>
        <AssignedAuthorForProofingInfo>
          {authorTeam?.members.length === 0 &&
            'Requires an author to be invited!'}
        </AssignedAuthorForProofingInfo>
      </SectionRowGrid>
      {isAuthorProofingEnabled ? (
        <AssignedAuthorForProofingLogsContainer>
          <AssignedAuthorForProofingLogsToggle
            onClick={() => setToggled(!isToggled)}
          >
            {isToggled
              ? `Hide all authors assigned`
              : `Show all authors assigned`}
          </AssignedAuthorForProofingLogsToggle>
          {isToggled && (
            <AssignedAuthorForProofingLogs>
              {manuscript?.authorFeedback?.assignedAuthors &&
                manuscript?.authorFeedback?.assignedAuthors.map(assignee => (
                  <>
                    <span>
                      {assignee.authorName} assigned on{' '}
                      {convertTimestampToDateTimeString(
                        assignee.assignedOnDate,
                      )}
                    </span>
                    <br />
                  </>
                ))}
            </AssignedAuthorForProofingLogs>
          )}
        </AssignedAuthorForProofingLogsContainer>
      ) : (
        <></>
      )}
    </SectionContent>
  )
}

export default AssignAuthorForProofing
