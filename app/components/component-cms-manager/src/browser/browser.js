import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useMutation, useQuery } from '@apollo/client'
import FolderTree from 'react-folder-tree'

import { Select, Spinner } from '../../../shared'

import {
  addResourceToFolder,
  deleteResource,
  renameResource,
  getFoldersList,
  updateFlaxRootFolder,
} from '../queries'

const SpanActive = styled.span`
  font-weight: bold;
  margin-left: 10px;
`

const findClickedFolder = (state, path) => {
  const currentItem = state.children[path.shift()]

  if (path.length > 0) {
    return findClickedFolder(currentItem, path)
  }

  return currentItem || state
}

const Browser = ({ onNameClick, getTreeData, treeData, loading }) => {
  const [addObject] = useMutation(addResourceToFolder)
  const [deleteObject] = useMutation(deleteResource)
  const [renameObject] = useMutation(renameResource)
  const [updateFlaxFolder] = useMutation(updateFlaxRootFolder)

  const { loadingFolders, data: dataFolders } = useQuery(getFoldersList)

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
        onChange={selected => {
          updateFlaxFolder({ variables: { id: selected.value } })
        }}
        options={selectOptions}
        value={selectedOption?.value}
        width="100%"
      />
    </>
  )
}

export default Browser
