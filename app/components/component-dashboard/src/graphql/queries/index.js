import { gql } from '@apollo/client'

const manuscriptFragment = `
id
shortId
teams {
  id
  role
  name
  members {
    id
    user {
      id
      username
    }
    status
    updated
  }
}
status
meta {
  manuscriptId
  history {
    type
    date
  }
}
submission
created
updated
firstVersionCreated
published
hasOverdueTasksForUser
invitations {
  status
}
`

const activeFormsInCategoryFragment = `activeFormsInCategory(category: "submission", groupId: $groupId) {
  id
  category
  structure {
    purpose
    children
  }
}
`

export default {
  dashboard: gql`
    query Dashboard($reviewerStatus: String, $wantedRoles: [String]!, $sort: ManuscriptsSort, $filters: [ManuscriptsFilter!]!, $offset: Int, $limit: Int, $timezoneOffsetMinutes: Int, $groupId: ID!) {
      manuscriptsUserHasCurrentRoleIn(
        reviewerStatus: $reviewerStatus
        wantedRoles: $wantedRoles
        sort: $sort
        filters: $filters
        offset: $offset
        limit: $limit
        timezoneOffsetMinutes: $timezoneOffsetMinutes
        groupId: $groupId)
        {
          totalCount
          manuscripts {
            manuscriptVersions {
              ${manuscriptFragment}
              parentId
            }
            ${manuscriptFragment}
            searchSnippet
          }
        }
      submissionForms: ${activeFormsInCategoryFragment}
    }
  `,
}
