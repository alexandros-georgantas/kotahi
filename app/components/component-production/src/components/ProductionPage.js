import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import ReactRouterPropTypes from 'react-router-prop-types'
import Production from './Production'
import { Spinner, CommsErrorBanner } from '../../../shared'

const fragmentFields = `
  id
  created
  status
  files {
    id
    fileType
    mimeType
  }
  meta {
    title
    source
    manuscriptId
  }
`

const query = gql`
  query($id: ID!) {
    currentUser {
      id
      username
      admin
      defaultIdentity {
        name
      }
    }

    manuscript(id: $id) {
      ${fragmentFields}
    }
  }
`

export const updateMutation = gql`
  mutation($id: ID!, $input: String) {
    updateManuscript(id: $id, input: $input) {
      id
      ${fragmentFields}
    }
  }
`

const ProductionPage = ({ match, ...props }) => {
  const [update] = useMutation(updateMutation)

  const updateManuscript = (versionId, manuscriptDelta) => {
    return update({
      variables: {
        id: versionId,
        input: JSON.stringify(manuscriptDelta),
      },
    })
  }

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: match.params.version,
    },
  })

  ProductionPage.propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  }

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />
  const { manuscript, currentUser } = data

  return (
    <Production
      currentUser={currentUser}
      file={manuscript.files.find(file => file.fileType === 'manuscript') || {}}
      manuscript={manuscript}
      updateManuscript={updateManuscript}
    />
  )
}

export default ProductionPage
