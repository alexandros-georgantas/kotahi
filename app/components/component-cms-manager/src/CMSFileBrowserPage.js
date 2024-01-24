import React, { useEffect, useState, useCallback } from 'react' // { useContext, useState }
import { pick, isEmpty, debounce } from 'lodash'
import styled from 'styled-components'

import { useLazyQuery, useMutation } from '@apollo/client'
// import { useTranslation } from 'react-i18next'
import FolderTree from 'react-folder-tree'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

import 'react-folder-tree/dist/style.css'

import { Spinner, CommsErrorBanner, Select } from '../../shared'

// import { ConfigContext } from '../../config/src'

import { EditPageContainer, EditPageLeft, EditPageRight } from './style'

import {
  getCmsFilesTreeView,
  getCmsFileContent,
  addResourceToFolder,
  deleteResource,
  renameResource,
  updateResource,
  // getFoldersList,
} from './queries'

const EditPageLeftStyled = styled(EditPageLeft)`
  min-width: 312px;

  > div {
    padding-left: 10px;
    padding-right: 25px;
  }
`

const SpanActive = styled.span`
  font-weight: bold;
  margin-left: 10px;
`

const searchAddChildren = (treeData, { id, children }) => {
  if (
    treeData.id === id &&
    (treeData.children.length === 0 ||
      treeData.children.length !== children.length)
  ) {
    return {
      ...treeData,
      isOpen: true,
      children: children.map(child => {
        return child.fileId
          ? pick(child, ['id', 'fileId', 'name'])
          : {
              ...pick(child, ['id', 'fileId', 'name']),
              isOpen: false,
              children: [],
            }
      }),
    }
  }

  if (treeData.children && treeData.children.length > 0) {
    return {
      ...treeData,
      name: treeData.name,
      children: treeData.children.map(child =>
        searchAddChildren(child, { id, children }),
      ),
    }
  }

  return treeData
}

const findClickedFolder = (state, path) => {
  const currentItem = state.children[path.shift()]

  if (path.length > 0) {
    return findClickedFolder(currentItem, path)
  }

  return currentItem || state
}

const CMSFileBrowserPage = () => {
  // const { t } = useTranslation()
  const [activeContent, setActiveContent] = useState({ id: null, content: '' })
  const [treeData, setTreeData] = useState({})
  const [addObject] = useMutation(addResourceToFolder)
  const [deleteObject] = useMutation(deleteResource)
  const [renameObject] = useMutation(renameResource)
  const [updateObject] = useMutation(updateResource)

  // const { loadingFolders, data: dataFolders } = useQuery(getFoldersList)

  const [getFileData] = useLazyQuery(getCmsFileContent, {
    onCompleted: ({ getCmsFileContent: Content }) => {
      setActiveContent({ id: Content.id, content: Content.content })
    },
  })

  const [getTreeData, { loading, error }] = useLazyQuery(getCmsFilesTreeView, {
    fetchPolicy: 'network-only',
    onCompleted: ({ getCmsFilesTreeView: data }) => {
      if (isEmpty(treeData)) {
        setTreeData({
          ...data,
          isOpen: true,
          children: data.children.map(child => {
            return child.fileId
              ? pick(child, ['id', 'name', 'fileId'])
              : {
                  ...pick(child, ['id', 'name', 'fileId']),
                  isOpen: false,
                  children: [],
                }
          }),
        })
      } else {
        const updatedTreeData = searchAddChildren(treeData, data)
        setTreeData({
          ...updatedTreeData,
        })
      }
    },
  })

  useEffect(() => {
    getTreeData({
      variables: {
        folderId: null,
      },
    })
  }, [])

  const onChangeContent = useCallback(
    debounce(async cont => {
      const updatedContent = {
        id: activeContent.id,
        content: cont,
      }

      await updateObject({
        variables: updatedContent,
      })
      setActiveContent(updatedContent)
    }, '2000'),
    [activeContent.id],
  )

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

  const onNameClick = ({ defaultOnClick, nodeData }) => {
    defaultOnClick()

    if (nodeData.fileId) {
      getFileData({
        variables: {
          id: nodeData.fileId,
        },
      })
    }
  }

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  return (
    <EditPageContainer>
      <EditPageLeftStyled>
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
          // onChange={selected => {
          //   console.log(selected)
          // }}
          // options={groups}
          // value={selectedOption}
          width="100%"
        />
      </EditPageLeftStyled>
      <EditPageRight>
        <CodeMirror
          extensions={[css(), html()]}
          onChange={onChangeContent}
          value={activeContent.content}
        />
      </EditPageRight>
    </EditPageContainer>
  )
}

export default CMSFileBrowserPage
