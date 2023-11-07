import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import ReactRouterPropTypes from 'react-router-prop-types'
import ReviewPreview from './reviewPreview/ReviewPreview'
import { Heading, Page, Spinner } from '../../../shared'
import { ConfigContext } from '../../../config/src'
import { getComponentsForManuscriptVersions } from '../../../component-form/src'

const fragmentFields = `
  id
  shortId
  created
  status
  meta {
    manuscriptId
  }
  submission
  files {
    id
    name
    tags
    storedObjects {
      mimetype
      url
    }
  }
`

const query = gql`
  query($id: ID!, $groupId: ID) {
    manuscript(id: $id) {
      ${fragmentFields}
      manuscriptVersions {
        ${fragmentFields}
      }
    }

    submissionForms: activeFormsInCategory(category: "submission", groupId: $groupId) {
      id
      category
      structure {
        purpose
        children
      }
    }
  }
`

const ReviewPreviewPage = ({ match, currentUser }) => {
  const config = useContext(ConfigContext)

  const { loading, error, data } = useQuery(query, {
    variables: {
      id: match.params.version,
      groupId: config.groupId,
    },
    partialRefetch: true,
  })

  if (loading) return <Spinner />

  if (error) {
    console.warn(error.message)
    return (
      <Page>
        <Heading>This review is no longer accessible.</Heading>
      </Page>
    )
  }

  const { manuscript: rawManuscript, submissionForms } = data

  const manuscript = rawManuscript
    ? { ...rawManuscript, submission: JSON.parse(rawManuscript.submission) }
    : null

  const submissionForm = submissionForms.find(
    f => f.structure.purpose === manuscript.submission.$$formPurpose,
  ) ?? {
    category: 'submission',
    structure: {
      name: '',
      purpose: '',
      children: [],
      description: '',
      haspopup: 'false',
    },
  }

  const componentsMap = getComponentsForManuscriptVersions(
    [{ manuscript }],
    { threadedDiscussions: [] },
    false,
  )

  return (
    <ReviewPreview
      customComponents={componentsMap[manuscript.id]}
      manuscript={manuscript}
      submissionForm={submissionForm}
    />
  )
}

ReviewPreviewPage.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
}

export default ReviewPreviewPage
