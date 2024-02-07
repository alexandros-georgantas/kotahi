import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import { useMutation, useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import FolderTree from 'react-folder-tree'
import { Link } from '@pubsweet/ui'

import { Select, Spinner } from '../../../shared'
import { ConfigContext } from '../../../config/src'

import { FormActionButton } from '../style'

import {
  addResourceToFolder,
  deleteResource,
  renameResource,
  getFoldersList,
  updateFlaxRootFolder,
  rebuildFlaxSiteMutation,
} from '../queries'

const SpanActive = styled.span`
  display: flex;
  font-weight: bold;
  margin-left: 10px;
`

const FormActionButtonStyled = styled(FormActionButton)`
  margin-left: 10px;
  margin-top: 10px;
  width: 88%;
`

const FlaxLink = styled(Link)`
  margin-left: 10px;
  margin-top: 10px;
`

const findClickedFolder = (state, path) => {
  const currentItem = state.children[path.shift()]

  if (path.length > 0) {
    return findClickedFolder(currentItem, path)
  }

  return currentItem || state
}

const Browser = ({ onNameClick, getTreeData, treeData, loading }) => {
  const config = useContext(ConfigContext)
  const { groupName } = config

  const [addObject] = useMutation(addResourceToFolder)
  const [deleteObject] = useMutation(deleteResource)
  const [renameObject] = useMutation(renameResource)
  const [updateFlaxFolder] = useMutation(updateFlaxRootFolder)
  const [rebuildFlaxSite] = useMutation(rebuildFlaxSiteMutation)

  const flaxSiteUrlForGroup = `${process.env.FLAX_SITE_URL}/${groupName}/`

  const { t } = useTranslation()

  const [submitButtonText, setSubmitButtonText] = useState(
    t('cmsPage.layout.Publish'),
  )

  const { loadingFolders, data: dataFolders, refetch } = useQuery(
    getFoldersList,
  )

  const publish = async () => {
    setSubmitButtonText(t('cmsPage.layout.Saving data'))

    setSubmitButtonText(t('cmsPage.layout.Rebuilding Site'))
    await rebuildFlaxSite({
      variables: {
        params: JSON.stringify({
          path: 'pages',
        }),
      },
    })
    setSubmitButtonText(t('cmsPage.layout.Published'))
  }

  const onTreeStateChange = async (state, event) => {
    if (
      event.type === 'toggleOpen' &&
      event.params &&
      event.params[0] === true
    ) {
      const item = findClickedFolder(treeData, event.path)

      if (item && item.children.length === 0) {
        getTreeData({
          variables: {
            folderId: item.id,
          },
        })
      }
    } else if (event.type === 'addNode') {
      const item = findClickedFolder(treeData, event.path)

      await addObject({
        variables: {
          id: item.id,
          type: event.params[0],
        },
      })

      getTreeData({
        variables: {
          folderId: item.id,
        },
      })
    } else if (event.type === 'deleteNode') {
      const item = findClickedFolder(treeData, event.path)

      const deletedObj = await deleteObject({
        variables: {
          id: item.id,
        },
      })

      getTreeData({
        variables: {
          folderId: deletedObj.data.deleteResource.parentId,
        },
      })
    } else if (event.type === 'renameNode') {
      const item = findClickedFolder(treeData, event.path)

      await renameObject({
        variables: {
          id: item.id,
          name: event.params[0],
        },
      })
    }
  }

  const selectOptions = ((dataFolders || {}).getFoldersList || []).map(fld => ({
    value: fld.id,
    label: fld.name,
    rootFolder: fld.rootFolder,
  }))

  const selectedOption = selectOptions.find(fld => fld.rootFolder === true)

  if (loadingFolders || loading) return <Spinner />

  return (
    <>
      <FolderTree
        data={treeData}
        initOpenStatus="custom"
        onChange={onTreeStateChange}
        onNameClick={onNameClick}
        showCheckbox={false}
      />
      <hr />
      <SpanActive>Root Flax Folder:</SpanActive>
      <Select
        aria-label="Select Folder"
        isClearable={false}
        label="Select Folder"
        onChange={async selected => {
          await updateFlaxFolder({ variables: { id: selected.value } })
          refetch()
        }}
        options={selectOptions}
        value={selectedOption?.value}
        width="100%"
      />
      <FormActionButtonStyled onClick={publish} primary type="button">
        {submitButtonText}
      </FormActionButtonStyled>
      <hr />
      <SpanActive>Published Flax Url:</SpanActive>
      <FlaxLink
        rel="noopener noreferrer"
        target="_blank"
        to={flaxSiteUrlForGroup}
      >
        {flaxSiteUrlForGroup}
      </FlaxLink>
    </>
  )
}

export default Browser
