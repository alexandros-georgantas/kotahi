import React, { useEffect, useState } from 'react' // { useContext, useState }
import { pick, isEmpty } from 'lodash'
import styled from 'styled-components'

import { useLazyQuery } from '@apollo/client'
// import { useTranslation } from 'react-i18next'
import FolderTree from 'react-folder-tree'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

import 'react-folder-tree/dist/style.css'

import { Spinner, CommsErrorBanner } from '../../shared'

// import { ConfigContext } from '../../config/src'

import { EditPageContainer, EditPageLeft, EditPageRight } from './style'

import { getCmsFilesTreeView, getCmsFileContent } from './queries'

const EditPageLeftStyled = styled(EditPageLeft)`
  width: auto;

  > div {
    padding-right: 15px;
  }
`

const searchAddChildren = (treeData, { id, children }) => {
  if (treeData.id === id && treeData.children.length === 0) {
    return {
      ...treeData,
      name: treeData.name.split('/').pop(),
      isOpen: true,
      children: children.map(child => {
        return child.fileId
          ? {
              ...pick(child, ['id', 'fileId']),
              name: child.name.split('/').pop(),
            }
          : {
              ...pick(child, ['id', 'fileId']),
              name: child.name.split('/').pop(),
              isOpen: false,
              children: [],
            }
      }),
    }
  }

  if (treeData.children && treeData.children.length > 0) {
    return {
      ...treeData,
      name: treeData.name.split('/').pop(),
      children: treeData.children.map(child =>
        searchAddChildren(child, { id, children }),
      ),
    }
  }

  return { ...treeData, name: treeData.name.split('/').pop() }
}

const findClickedFolder = (state, path) => {
  const currentItem = state.children[path.shift()]

  if (path.length > 0) {
    return findClickedFolder(currentItem, path)
  }

  return currentItem
}

const CMSFileBrowserPage = () => {
  // const { t } = useTranslation()
  const [content, setContent] = useState('')
  const [treeData, setTreeData] = useState({})
  // const config = useContext(ConfigContext)

  const [getFileData] = useLazyQuery(getCmsFileContent, {
    onCompleted: ({ getCmsFileContent: { content: textContent } }) => {
      setContent(textContent)
    },
  })

  const [getTreeData, { loading, error }] = useLazyQuery(getCmsFilesTreeView, {
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

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  const onTreeStateChange = (state, event) => {
    if (
      event.type === 'toggleOpen' &&
      event.params &&
      event.params[0] === true
    ) {
      const item = findClickedFolder(state, event.path)

      if (item && item.children.length === 0) {
        getTreeData({
          variables: {
            folderId: item.id,
          },
        })
      }
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
      </EditPageLeftStyled>
      <EditPageRight>
        <CodeMirror
          extensions={[css(), html()]}
          // onChange={}
          value={content}
        />
      </EditPageRight>
    </EditPageContainer>
  )
}

export default CMSFileBrowserPage
