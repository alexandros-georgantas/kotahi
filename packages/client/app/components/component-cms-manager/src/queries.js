import { gql } from '@apollo/client'

const fileFields = `
    id
    name
    tags
    storedObjects {
      mimetype
      key
      url
      type
    }
`

const flaxPageConfigFields = `
    id
    title
    sequenceIndex
    shownInMenu
    url
`

const cmsPageFields = `
    id
    content
    created
    url
    status
    title
    updated
    published
    edited
    creator {
      id
      username
    }
    language
`

const cmsLayoutFields = `
    id
    created
    updated
    languageLayouts {
      id
      primaryColor
      secondaryColor
      footerText
      flaxHeaderConfig {
        ${flaxPageConfigFields}
      }
      flaxFooterConfig {
        ${flaxPageConfigFields}
      }
      partners {
        id
        url
        sequenceIndex
        file {
         ${fileFields}
        }
      }
      logoId
      logo {
        ${fileFields}
      }
      article
      css
      language
    }
    published
    edited
    isPrivate
    hexCode
`

const createCmsPageFields = `
    cmsPage {
      id
      url
      content
    }
    success
    error
    column
    errorMessage
    language
`

const deleteCmsPageFields = `
    success
    error
`

export const getCMSPages = gql`
  query cmsPages {
    cmsPages {
      ${cmsPageFields}
    }
  }
`

export const getCMSPage = gql`
  query cmsPage($id: ID!) {
    cmsPage(id: $id) {
      ${cmsPageFields}
    }
  }
`

export const createCMSPageMutation = gql`
  mutation createCMSPage($input: CMSPageInput!) {
    createCMSPage(input: $input) {
      ${createCmsPageFields}
    }
  }
`

export const deleteCMSPageMutation = gql`
  mutation deleteCMSPage($id: ID!) {
    deleteCMSPage(id: $id) {
        ${deleteCmsPageFields}
    }
  }
`
export const rebuildFlaxSiteMutation = gql`
  mutation rebuildFlaxSite($params: String) {
    rebuildFlaxSite(params: $params) {
      status
      error
    }
  }
`

export const getCmsLayoutSet = gql`
query cmsLayoutSet {
  cmsLayoutSet {
    ${cmsLayoutFields}
  }
}
`

export const updateCmsLayoutMutation = gql`
  mutation updateCmsLayout($input: CmsLayoutInput!) {
    updateCmsLayout(input: $input) {
      ${cmsLayoutFields}
    }
  }
`

export const createFileMutation = gql`
  mutation ($file: Upload!, $meta: FileMetaInput!) {
    createFile(file: $file, meta: $meta) {
      id
      created
      name
      updated
      name
      tags
      objectId
      storedObjects {
        key
        mimetype
        url
      }
    }
  }
`

export const deleteFileMutation = gql`
  mutation ($id: ID!) {
    deleteFile(id: $id)
  }
`

export const updateCmsLanguagesMutation = gql`
  mutation ($languages: [String!]!) {
    updateCmsLanguages(languages: $languages) {
      ${cmsLayoutFields}
    }
  }
`
