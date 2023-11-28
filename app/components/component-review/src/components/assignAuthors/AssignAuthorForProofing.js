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

const AssignAuthorForProofing = ({ assignAuthorForProofing, manuscript }) => {
  const [isToggled, setToggled] = useState(false)

  const isAuthorProofingEnabled = ['assigned', 'inProgress'].includes(
    manuscript.status,
  )

  const [submitAuthorProofingStatus, setSubmitAuthorProofingStatus] = useState(
    null,
  )

  const authorTeam = manuscript.teams.find(team => team.role === 'author')

  const sortedAuthors = authorTeam?.members
    .slice()
    .sort(
      (a, b) =>
        Date.parse(new Date(b.created)) - Date.parse(new Date(a.created)),
    )

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
              {sortedAuthors.slice(0, 1).map(member => (
                <>
                  <span>
                    {member?.user?.username ||
                      member?.user?.defaultIdentity?.name}
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
