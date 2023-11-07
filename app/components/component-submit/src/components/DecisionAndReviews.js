import React from 'react'

// TODO: Sort out the imports, perhaps make DecisionReview a shared component?
import DecisionReview from '../../../component-review/src/components/decision/DecisionReview'
import { ReadonlyFormTemplate } from '../../../component-form/src'

import {
  SectionHeader,
  SectionRow,
  Title,
  SectionContent,
} from '../../../shared'

const Decision = ({
  decisionForm,
  decisionFormComponents,
  manuscript,
  showEditorOnlyFields,
  allowAuthorsSubmitNewVersion,
}) => {
  const decisionData = manuscript.reviews.find(r => r.isDecision)?.jsonData

  const filteredForm = !manuscript.decision
    ? {
        ...decisionForm,
        structure: {
          ...decisionForm.structure,
          children: decisionForm.structure.children.filter(
            formComponent => formComponent.component === 'ThreadedDiscussion',
          ),
        },
      }
    : decisionForm

  return decisionData ? (
    <ReadonlyFormTemplate
      allowAuthorsSubmitNewVersion={allowAuthorsSubmitNewVersion}
      customComponents={decisionFormComponents}
      form={filteredForm}
      formData={decisionData}
      hideSpecialInstructions
      manuscript={manuscript}
      showEditorOnlyFields={showEditorOnlyFields}
    />
  ) : (
    <SectionRow>Pending.</SectionRow>
  )
}

const DecisionAndReviews = ({
  manuscript,
  isControlPage = false,
  reviewForm,
  reviewFormComponents,
  decisionForm,
  decisionFormComponents,
  showEditorOnlyFields,
  currentUser,
  allowAuthorsSubmitNewVersion,
}) => {
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
          allowAuthorsSubmitNewVersion={allowAuthorsSubmitNewVersion}
          decisionForm={decisionForm}
          decisionFormComponents={decisionFormComponents}
          editor={decision?.user}
          manuscript={manuscript}
          showEditorOnlyFields={showEditorOnlyFields}
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
                currentUser={currentUser}
                isControlPage={isControlPage}
                open
                readOnly
                review={review}
                reviewer={{
                  name: review.user?.username,
                  ordinal: index + 1,
                  user: review.user,
                }}
                reviewForm={reviewForm}
                reviewFormComponents={reviewFormComponents}
                showEditorOnlyFields={showEditorOnlyFields}
                teams={manuscript.teams}
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
