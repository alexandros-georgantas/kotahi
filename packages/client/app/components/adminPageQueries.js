import gql from 'graphql-tag'

const QUERY = gql`
  query {
    currentUser {
      id
      profilePicture
      username
      globalRoles
      groupRoles
      email
      recentTab
      menuPinned
      preferredLanguage
      chatExpanded
      defaultIdentity {
        identifier
        email
        type
        aff
        id
      }
      isOnline
    }
    builtCss {
      css
    }
    userHasTaskAlerts
  }
`

export default QUERY
