import React from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Container } from '../../../shared'
import { GET_INVITATION_STATUS } from '../../../../queries/index'
import InvitationLinkExpired from './InvitationLinkExpired'

const AcceptArticleOwnershipPage = ({ match }) => {
  const authorInvitationId = match.params.invitationId

  window.localStorage.setItem('authorInvitationId', authorInvitationId)

  const { loading, data, error } = useQuery(GET_INVITATION_STATUS, {
    variables: { id: authorInvitationId },
  })

  if (loading || error) {
    return null
  }

  if (data.invitationStatus.status === 'UNANSWERED') {
    return (
      <Container>
        ACCEPTING ownership of article using invitation: {authorInvitationId}
        <br />
        <br />I will autoredirect in a few moments...
        <Redirect to="/login" />
      </Container>
    )
  }

  return <InvitationLinkExpired />
}

export default AcceptArticleOwnershipPage
