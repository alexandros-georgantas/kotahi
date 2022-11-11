import React from 'react'
import { Button } from '@pubsweet/ui'
import { Container, Placeholder } from '../style'
import EditorItem from './sections/EditorItem'
import OwnerItem from './sections/OwnerItem'
import ReviewerItem from './sections/ReviewerItem'
import SearchControl from '../../../component-manuscripts/src/SearchControl'
import {
  SectionHeader,
  Title,
  SectionRow,
  SectionContent,
  Heading,
  HeadingWithAction,
} from '../../../shared'
import { ControlsContainer } from '../../../component-manuscripts/src/style'
import { FlexRow } from '../../../../globals'

const getRoles = (m, userId) =>
  m.teams
    .filter(t => t.members.some(member => member.user.id === userId))
    .map(t => t.role)

const Dashboard = ({
  newSubmission,
  instanceName,
  authorLatestVersions,
  reviewerLatestVersions,
  currentUser,
  reviewerRespond,
  updateMemberStatus,
  editorLatestVersions,
  urlFrag,
  shouldShowShortId,
  prettyRoleText,
  applySearchQuery,
  currentSearchQuery,
}) => {
  return (
    <Container>
      <FlexRow>
        <Heading>Dashboard</Heading>
        <ControlsContainer>
          <SearchControl
            applySearchQuery={applySearchQuery}
            currentSearchQuery={currentSearchQuery}
          />
          <Button onClick={newSubmission} primary>
            ＋ New submission
          </Button>
        </ControlsContainer>
      </FlexRow>
      {!['ncrc'].includes(instanceName) && (
        <SectionContent>
          <SectionHeader>
            <Title>My Submissions</Title>
          </SectionHeader>
          {authorLatestVersions.length > 0 ? (
            authorLatestVersions.map(version => (
              // Links are based on the original/parent manuscript version
              <OwnerItem
                instanceName={instanceName}
                // deleteManuscript={() =>
                //   // eslint-disable-next-line no-alert
                //   window.confirm(
                //     'Are you sure you want to delete this submission?',
                //   ) && deleteManuscript({ variables: { id: submission.id } })
                // }
                key={version.id}
                shouldShowShortId={shouldShowShortId}
                urlFrag={urlFrag}
                version={version}
              />
            ))
          ) : (
            <Placeholder>
              You have not submitted any manuscripts yet
            </Placeholder>
          )}
        </SectionContent>
      )}
      {!['ncrc'].includes(instanceName) && (
        <SectionContent>
          <SectionHeader>
            <Title>To Review</Title>
          </SectionHeader>
          {reviewerLatestVersions.length > 0 ? (
            reviewerLatestVersions.map(version => (
              <ReviewerItem
                currentUser={currentUser}
                key={version.id}
                reviewerRespond={reviewerRespond}
                updateMemberStatus={updateMemberStatus}
                urlFrag={urlFrag}
                version={version}
              />
            ))
          ) : (
            <Placeholder>
              You have not been assigned any reviews yet
            </Placeholder>
          )}
        </SectionContent>
      )}

      <SectionContent>
        <SectionHeader>
          <Title>Manuscripts I&apos;m editor of</Title>
        </SectionHeader>
        {editorLatestVersions.length > 0 ? (
          editorLatestVersions.map(manuscript => (
            <SectionRow key={`manuscript-${manuscript.id}`}>
              <EditorItem
                currentRoles={getRoles(manuscript, currentUser.id)}
                instanceName={instanceName}
                prettyRoleText={prettyRoleText}
                shouldShowShortId={shouldShowShortId}
                urlFrag={urlFrag}
                version={manuscript}
              />
            </SectionRow>
          ))
        ) : (
          <SectionRow>
            <Placeholder>
              You are not an editor of any manuscript yet
            </Placeholder>
          </SectionRow>
        )}
      </SectionContent>
    </Container>
  )
}

export default Dashboard
