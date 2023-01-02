import React from 'react'

// TODO: Sort out the imports, perhaps make DecisionReview a shared component?
import DecisionReview from '../../../component-review/src/components/decision/DecisionReview'
import useCurrentUser from '../../../../hooks/useCurrentUser'
import ReadonlyFormTemplate from '../../../component-review/src/components/metadata/ReadonlyFormTemplate'

import {
  SectionHeader,
  SectionRow,
  Title,
  SectionContent,
} from '../../../shared'

const Decision = ({
  decisionForm,
  manuscript,
  showEditorOnlyFields,
  threadedDiscussionProps,
}) => {
  const decisionDataString = manuscript.reviews.find(r => r.isDecision)
    ?.jsonData

  const decisionData = decisionDataString
    ? JSON.parse(decisionDataString)
    : null

  return decisionData ? (
    <ReadonlyFormTemplate
      form={decisionForm}
      formData={decisionData}
      hideSpecialInstructions
      manuscript={manuscript}
      showEditorOnlyFields={showEditorOnlyFields}
      threadedDiscussionProps={threadedDiscussionProps}
    />
  ) : (
    <SectionRow>Pending.</SectionRow>
  )
}

const DecisionAndReviews = ({
  manuscript,
  isControlPage = false,
  reviewForm,
  decisionForm,
  showEditorOnlyFields,
  threadedDiscussionProps,
}) => {
  const currentUser = useCurrentUser()

  const decision =
    manuscript.reviews &&
    !!manuscript.reviews.length &&
    manuscript.reviews.find(review => review.isDecision)

  const reviews =
    (Array.isArray(manuscript.reviews) &&
      manuscript.reviews.filter(review => !review.isDecision)) ||
    []

  if (!currentUser) return null

  const authorTeam =
    manuscript.teams &&
    !!manuscript.teams.length &&
    manuscript.teams.find(team => {
      return team.role.toLowerCase().includes('author')
    })

  const isCurrentUserAuthor = authorTeam
    ? authorTeam.members.find(member => member.user.id === currentUser.id)
    : false

  const reviewsToShow = isControlPage
    ? reviews
    : reviews.filter(
        review => !review.isHiddenFromAuthor && isCurrentUserAuthor,
      )

  return (
    <>
      <SectionContent>
        <SectionHeader>
          <Title>Decision</Title>
        </SectionHeader>
        <Decision
          decisionForm={decisionForm}
          editor={decision?.user}
          manuscript={manuscript}
          showEditorOnlyFields={showEditorOnlyFields}
          threadedDiscussionProps={threadedDiscussionProps}
        />
      </SectionContent>
      <SectionContent>
        <SectionHeader>
          <Title>Reviews</Title>
        </SectionHeader>

        {reviewsToShow.length ? (
          reviewsToShow.map((review, index) => (
            <SectionRow key={review.id}>
              <DecisionReview
                isControlPage={isControlPage}
                open
                readOnly
                review={review}
                reviewer={{
                  name: review.user.username,
                  ordinal: index + 1,
                  user: review.user,
                }}
                reviewForm={reviewForm}
                showEditorOnlyFields={showEditorOnlyFields}
                teams={manuscript.teams}
                threadedDiscussionProps={threadedDiscussionProps}
              />
            </SectionRow>
          ))
        ) : (
          <SectionRow>
            {reviews.length ? 'No reviews to show.' : 'No completed reviews.'}
          </SectionRow>
        )}
      </SectionContent>
    </>
  )
}

export default DecisionAndReviews
