import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ConfigContext } from '../../config/src'
import { Spinner, CommsErrorBanner } from '../../shared'

import {
  getCmsLayoutSet,
  updateCmsLayoutMutation,
  rebuildFlaxSiteMutation,
  createFileMutation,
  deleteFileMutation,
  updateCmsLanguagesMutation,
} from './queries'
import CmsLayouts from './layout/CmsLayouts'

const CMSLayoutPage = ({ history }) => {
  const { loading, data, error } = useQuery(getCmsLayoutSet)
  const [doUpdateCmsLayout] = useMutation(updateCmsLayoutMutation)
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

  const updateCmsLayout = async delta => {
    doUpdateCmsLayout({
      variables: {
        input: delta,
      },
    })
  }

  const publish = async formData => {
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

  const { cmsLayoutSet } = data

  return (
    <CmsLayouts
      cmsLayoutSet={cmsLayoutSet}
      createFile={createFile}
      deleteFile={deleteFile}
      flaxSiteUrlForGroup={flaxSiteUrlForGroup}
      history={history}
      publish={publish}
      publishingStatus={publishingStatus}
      updateCmsLanguages={updateCmsLanguages}
      updateCmsLayout={updateCmsLayout}
    />
  )
}

export default CMSLayoutPage
