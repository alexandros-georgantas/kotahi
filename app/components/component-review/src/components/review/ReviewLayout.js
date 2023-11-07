import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { Tabs } from '@pubsweet/ui'

import {
  FormTemplate,
  ReadonlyFormTemplate,
  getComponentsForManuscriptVersions,
} from '../../../../component-form/src'
import Review from './Review'
import EditorSection from '../decision/EditorSection'
import { Columns, Manuscript, Chat, SectionContent } from '../../../../shared'
import MessageContainer from '../../../../component-chat/src/MessageContainer'
import SharedReviewerGroupReviews from './SharedReviewerGroupReviews'
import { ConfigContext } from '../../../../config/src'

const hasManuscriptFile = manuscript =>
  !!manuscript?.files?.find(file => file.tags.includes('manuscript'))

const ReviewLayout = ({
  currentUser,
  versions,
  review,
  reviewForm,
  onSubmit,
  // isValid,
  status,
  updateReview,
  updateReviewJsonData,
  uploadFile,
  channelId,
  submissionForm,
  createFile,
  deleteFile,
  validateDoi,
  validateSuffix,
  decisionForm,
  threadedDiscussionProps,
}) => {
  const config = useContext(ConfigContext)
  const reviewSections = []
  const latestVersion = versions[0].manuscript
  const priorVersions = versions.slice(1).map(v => v.manuscript)
  priorVersions.reverse() // Convert to chronological order (was reverse-chron)

  const componentsMap = getComponentsForManuscriptVersions(
    versions,
    threadedDiscussionProps,
    false,
  )

  const decision = latestVersion.reviews.find(r => r.isDecision) || {}

  const decisionIsComplete = [
    'accepted',
    'revise',
    'rejected',
    'evaluated',
    'published',
  ].includes(latestVersion.status)

  const redactedDecisionForm = decisionIsComplete
    ? decisionForm
    : {
        ...decisionForm,
        structure: {
          ...decisionForm.structure,
          children: decisionForm.structure.children.filter(
            x => x.component === 'ThreadedDiscussion',
          ),
        },
      }

  priorVersions.forEach(msVersion => {
    if (msVersion.reviews?.some(r => !r.user))
      console.error(
        `Malformed review objects in manuscript ${msVersion.id}:`,
        msVersion.reviews,
      )

    const reviewForCurrentUser = msVersion.reviews?.find(
      r => r.user?.id === currentUser.id && !r.isDecision,
    )

    const reviewData = reviewForCurrentUser?.jsonData || {}

    const label = moment().format('YYYY-MM-DD')
    reviewSections.push({
      content: (
        <div key={msVersion.id}>
          {hasManuscriptFile(msVersion) && (
            <EditorSection
              currentUser={currentUser}
              manuscript={msVersion}
              readonly
            />
          )}
          <ReadonlyFormTemplate
            customComponents={componentsMap[msVersion.id]}
            form={submissionForm}
            formData={reviewData}
            manuscript={msVersion}
            showEditorOnlyFields={false}
          />
          <SharedReviewerGroupReviews
            customComponents={componentsMap[msVersion.id]}
            manuscript={msVersion}
            reviewerId={currentUser.id}
            reviewForm={reviewForm}
          />
          <Review
            customComponents={componentsMap[msVersion.id]}
            review={reviewForCurrentUser}
            reviewForm={reviewForm}
          />
        </div>
      ),
      key: msVersion.id,
      label,
    })
  }, [])

  if (latestVersion.status !== 'revising') {
    const reviewForCurrentUser = latestVersion.reviews?.find(
      r => r.user?.id === currentUser.id && !r.isDecision,
    )

    const reviewData = reviewForCurrentUser?.jsonData || {}

    const label = moment().format('YYYY-MM-DD')

    reviewSections.push({
      content: (
        <div key={latestVersion.id}>
          {hasManuscriptFile(latestVersion) && (
            <EditorSection
              currentUser={currentUser}
              manuscript={latestVersion}
              readonly
            />
          )}
          <ReadonlyFormTemplate // Display manuscript metadata
            customComponents={componentsMap[latestVersion.id]}
            form={submissionForm}
            formData={latestVersion}
            manuscript={latestVersion}
            showEditorOnlyFields={false}
          />
          <SharedReviewerGroupReviews
            customComponents={componentsMap[latestVersion.id]}
            manuscript={latestVersion}
            reviewerId={currentUser.id}
            reviewForm={reviewForm}
          />
          {status === 'completed' ? (
            <Review
              customComponents={componentsMap[latestVersion.id]}
              review={review}
              reviewForm={reviewForm}
            />
          ) : (
            <SectionContent>
              <FormTemplate
                createFile={createFile}
                deleteFile={deleteFile}
                form={reviewForm}
                formData={reviewData}
                manuscriptId={latestVersion.id}
                manuscriptShortId={latestVersion.shortId}
                manuscriptStatus={latestVersion.status}
                onChange={updateReviewJsonData}
                onSubmit={onSubmit}
                shouldStoreFilesInForm
                showEditorOnlyFields={false}
                submissionButtonText="Submit"
                tagForFiles="review"
                validateDoi={validateDoi}
                validateSuffix={validateSuffix}
              />
            </SectionContent>
          )}
          {config?.review?.showSummary && (
            <ReadonlyFormTemplate
              customComponents={componentsMap[latestVersion.id]}
              form={redactedDecisionForm}
              formData={decision.jsonData || {}}
              hideSpecialInstructions
              manuscript={latestVersion}
              title="Evaluation summary"
            />
          )}
        </div>
      ),
      key: latestVersion.id,
      label,
    })
  }

  return (
    <Columns>
      <Manuscript>
        <Tabs
          activeKey={reviewSections[reviewSections.length - 1].key}
          sections={reviewSections}
          title="Versions"
        />
      </Manuscript>
      <Chat>
        <MessageContainer channelId={channelId} currentUser={currentUser} />
      </Chat>
    </Columns>
  )
}

ReviewLayout.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      manuscript: PropTypes.shape({
        id: PropTypes.string.isRequired,
        reviews: PropTypes.arrayOf(PropTypes.shape({})),
        status: PropTypes.string.isRequired,
        meta: PropTypes.shape({ source: PropTypes.string }).isRequired,
        files: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            storedObjects: PropTypes.arrayOf(PropTypes.object.isRequired),
          }).isRequired,
        ).isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  review: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  status: PropTypes.string,
  updateReview: PropTypes.func.isRequired,
  uploadFile: PropTypes.func,
  channelId: PropTypes.string.isRequired,
  submissionForm: PropTypes.shape({
    category: PropTypes.string.isRequired,
    structure: PropTypes.shape({
      purpose: PropTypes.string,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string,
          title: PropTypes.string,
          shortDescription: PropTypes.string,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
}

ReviewLayout.defaultProps = {
  onSubmit: () => {},
  review: undefined,
  status: undefined,
  uploadFile: undefined,
}

export default ReviewLayout
