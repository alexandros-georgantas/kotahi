import { gql } from '@apollo/client'

const reviewFields = `
  id
  created
  updated
  jsonData
  isDecision
  isHiddenFromAuthor
  isHiddenReviewerName
  canBePublishedPublicly
  user {
    id
    profilePicture
    defaultIdentity {
      id
      name
      identifier
    }
    username
  }
`

const formFields = `
  structure {
    name
    description
    haspopup
    popuptitle
    popupdescription
    children {
      title
      shortDescription
      id
      component
      name
      description
      doiValidation
      doiUniqueSuffixValidation
      placeholder
      parse
      format
      options {
        id
        label
        value
        labelColor
      }
      validate {
        id
        label
        value
      }
      validateValue {
        minChars
        maxChars
        minSize
      }
      hideFromAuthors
      permitPublishing
      readonly
    }
  }
`

const fragmentFields = `
  id
  shortId
  created
  files {
    id
    created
    updated
    name
    tags
    storedObjects {
      extension
      key
      mimetype
      size
      type
      url
    }
  }
  reviews {
    ${reviewFields}
  }
  teams {
    id
    role
    objectId
    objectType
    members {
      id
	  status
      user {
        id
        username
      }
    }
  }
  decision
  status
  authorFeedback {
    text
    fileIds
    edited
    submitted
    submitter {
      username
      defaultIdentity {
        name
      }
      id
    }
    assignedAuthors {
      authorName
      assignedOnDate
    }
  }
  meta {
    manuscriptId
    source
    history {
      type
      date
    }
  }
  authors {
    firstName
    lastName
    email
    affiliation
  }
  submission
  formFieldsToPublish {
    objectId
    fieldsToPublish
  }
`

const GET_MANUSCRIPT_AND_FORMS = gql`
  query($id: ID!, $groupId: ID, $submitPurpose: String!, $decisionPurpose: String!, $reviewPurpose: String!) {
    manuscript(id: $id) {
      ${fragmentFields}
      manuscriptVersions {
        parentId
        ${fragmentFields}
      }
      channels {
        id
        type
        topic
      }
    }

    submissionForm: formForPurposeAndCategory(purpose: $submitPurpose, category: "submission", groupId: $groupId) {
      ${formFields}
    }

    decisionForm: formForPurposeAndCategory(purpose: $decisionPurpose, category: "decision", groupId: $groupId) {
      ${formFields}
    }

    reviewForm: formForPurposeAndCategory(purpose: $reviewPurpose, category: "review", groupId: $groupId) {
      ${formFields}
    }

    threadedDiscussions(manuscriptId: $id) {
      id
      created
      updated
      manuscriptId
      threads {
        id
        comments {
          id
          manuscriptVersionId
          commentVersions {
            id
            author {
              id
              username
              profilePicture
            }
            comment
            created
          }
          pendingVersion {
            author {
              id
              username
              profilePicture
            }
            comment
          }
        }
      }
      userCanAddComment
      userCanEditOwnComment
      userCanEditAnyComment
    }
  }
`

const GET_MANUSCRIPT_TEAMS = gql`
  query GetManuscriptTeams($where: TeamWhereInput) {
    teams(where: $where) {
      id
      role
      members {
        id
        status
        user {
          id
          username
          profilePicture
        }
      }
    }
  }
`

const SEARCH_USERS_BY_NAME_OR_EMAIL = gql`
  mutation SearchUsersByNameOrEmail($search: String, $exclude: [ID]!) {
    searchUsersByNameOrEmail(search: $search, exclude: $exclude) {
      id
      profilePicture
      username
    }
  }
`

export {
  fragmentFields,
  GET_MANUSCRIPT_AND_FORMS,
  GET_MANUSCRIPT_TEAMS,
  reviewFields,
  SEARCH_USERS_BY_NAME_OR_EMAIL,
}
