import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ConfigContext } from '../../config/src'
import { Spinner, CommsErrorBanner } from '../../shared'

import {
  getCMSLayout,
  updateCMSLayoutMutation,
  updateCMSPageDataMutation,
  rebuildFlaxSiteMutation,
  createFileMutation,
  deleteFileMutation,
  updateCmsLanguagesMutation,
} from './queries'
import CmsLayout from './layout/CmsLayout'

const CMSLayoutPage = ({ history }) => {
  const { loading, data, error } = useQuery(getCMSLayout)
  const [updateCMSLayout] = useMutation(updateCMSLayoutMutation)
  const [updateCMSPageInfo] = useMutation(updateCMSPageDataMutation)
  const [rebuildFlaxSite] = useMutation(rebuildFlaxSiteMutation)
  const [createFile] = useMutation(createFileMutation)
  const config = useContext(ConfigContext)
  const { groupName } = config

  const flaxSiteUrlForGroup = `${process.env.FLAX_SITE_URL}/${groupName}/`

  const [deleteFile] = useMutation(deleteFileMutation, {
    update(cache, { data: { deleteFile: fileToDelete } }) {
      const id = cache.identify({
        __typename: 'File',
        id: fileToDelete,
      })

      cache.evict({ id })
    },
  })

  const [updateCmsLangsMutation] = useMutation(updateCmsLanguagesMutation)

  const [publishingStatus, setPublishingStatus] = useState(null)

  const updateCmsLanguages = async languages => {
    updateCmsLangsMutation({ variables: { languages } })
  }

  // TODO Rename to updateLayout, and figure out what is causing save on initial page load
  const triggerAutoSave = async formData => {
    updateCMSLayout({
      variables: {
        input: { ...formData, edited: new Date() },
      },
    })
  }

  const updatePageOrderInfo = (pageOrderInfo, key) => {
    pageOrderInfo.forEach(cmsPage => {
      const { id, sequenceIndex, shownInMenu } = cmsPage
      updateCMSPageInfo({
        variables: {
          id,
          input: {
            [key]: {
              sequenceIndex,
              shownInMenu,
            },
          },
        },
      })
    })
  }

  const publish = async formData => {
    setPublishingStatus('saving')
    // await updateCMSLayout({
    //   variables: {
    //     input: {
    //       primaryColor: formData.primaryColor,
    //       secondaryColor: formData.secondaryColor,
    //       logoId: formData.logoId,
    //       partners: formData.partners,
    //       footerText: formData.footerText,
    //       published: new Date(),
    //       language: formData.language,
    //     },
    //   },
    // })

    setPublishingStatus('rebuilding')
    await rebuildFlaxSite({
      variables: {
        params: JSON.stringify({
          path: 'pages',
        }),
      },
    })
    setPublishingStatus('published')
  }

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  const { cmsLayouts, cmsLanguages } = data

  // TODO Move this layout code out of the Page-level component
  return (
    <CmsLayout
      cmsLanguages={cmsLanguages}
      cmsLayouts={cmsLayouts}
      createFile={createFile}
      deleteFile={deleteFile}
      flaxSiteUrlForGroup={flaxSiteUrlForGroup}
      history={history}
      publish={publish}
      publishingStatus={publishingStatus}
      triggerAutoSave={triggerAutoSave}
      updateCmsLanguages={updateCmsLanguages}
      updatePageOrderInfo={updatePageOrderInfo}
    />
  )
}

export default CMSLayoutPage
