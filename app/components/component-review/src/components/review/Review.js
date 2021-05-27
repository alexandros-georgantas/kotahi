import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Attachment } from '@pubsweet/ui'
import { th, grid } from '@pubsweet/ui-toolkit'
import SimpleWaxEditor from '../../../../wax-collab/src/SimpleWaxEditor'

const Heading = styled.div``

const Note = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
`

const Recommendation = styled(Note)``
const Content = styled.div``

const Container = styled.div`
  margin-top: ${grid(3)};
`

// Due to migration to new Data Model
// Attachement component needs different data structure to work
// needs to change the pubsweet ui Attachement to support the new Data Model
const filesToAttachment = file => ({
  name: file.filename,
  url: file.url,
})

const ReviewComments = (review, type) => (
  <Note>
    <Content>
      <SimpleWaxEditor readonly value={review[`${type}Comment`].content} />
    </Content>
    {review[`${type}Comment`].files.map(attachment => (
      <Attachment
        file={filesToAttachment(attachment)}
        key={attachment.url}
        uploaded
      />
    ))}
  </Note>
)

const Review = ({ review, user }) => (
  <Container>
    {review?.reviewComment && (
      <div>
        <Heading>Review</Heading>

        {ReviewComments(review, 'review')}
      </div>
    )}
    {review?.confidentialComment && user.admin ? (
      <div>
        <Heading>Confidential</Heading>

        {ReviewComments(review, 'confidential')}
      </div>
    ) : null}
    {review?.recommendation && (
      <div>
        <Heading>Recommendation</Heading>

        <Recommendation>{review.recommendation}</Recommendation>
      </div>
    )}
  </Container>
)

Review.propTypes = {
  review: PropTypes.shape({
    reviewComment: PropTypes.string,
    confidentialComment: PropTypes.string,
    recommendation: PropTypes.string,
  }).isRequired,
  user: {
    admin: PropTypes.bool,
  },
}

Review.defaultProps = {
  user: {
    admin: false,
  },
}
export default Review
