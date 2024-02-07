import React, { useState, useCallback, useEffect } from 'react' // { useContext, useState }
import { debounce, isEmpty, pick } from 'lodash'
import styled from 'styled-components'

import { useLazyQuery, useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

import 'react-folder-tree/dist/style.css'

import Browser from './browser/browser'
import { CommsErrorBanner } from '../../shared'

import UploadComponent from '../../component-production/src/components/uploadManager/UploadComponent'

// import { ConfigContext } from '../../config/src'

import { EditPageContainer, EditPageLeft, EditPageRight } from './style'

import {
  getCmsFileContent,
  updateResource,
  getCmsFilesTreeView,
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

const CMSFileBrowserPage = () => {
  const { t } = useTranslation()

  const [imageSrc, setImageSrc] = useState('')
  const [treeData, setTreeData] = useState({})

  const [activeContent, setActiveContent] = useState({
    id: null,
    name: '',
    content: '',
    isFolder: false,
    isImage: false,
  })

  const [updateObject] = useMutation(updateResource)

  const [getFileData] = useLazyQuery(getCmsFileContent, {
    onCompleted: ({ getCmsFileContent: Content }) => {
      const extension = Content.name.split('.').pop().toLowerCase()
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']

      if (imageExtensions.includes(extension)) {
        setImageSrc(Content.url)
      }

      setActiveContent({
        id: Content.id,
        content: Content.content,
        name: Content.name,
        isImage: imageExtensions.includes(extension),
        isFolder: false,
      })
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
      setActiveContent({
        ...updatedContent,
        name: activeContent.name,
        isFolder: activeContent.isFolder,
      })
    }, '2000'),
    [activeContent.id],
  )

  const uploadAssetsFn = async acceptedFiles => {
    const body = new FormData()

    acceptedFiles.forEach(f => body.append('files', f))

    body.append('id', activeContent.id)

    await fetch('/api/cmsUploadFiles', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body,
    })

    getTreeData({
      variables: {
        folderId: activeContent.id,
      },
    })
  }

  const onNameClick = ({ defaultOnClick, nodeData }) => {
    defaultOnClick()

    if (nodeData.fileId) {
      getFileData({
        variables: {
          id: nodeData.fileId,
        },
      })
    } else {
      setActiveContent({
        id: nodeData.id,
        name: nodeData.name,
        content: null,
        isImage: false,
        isFolder: true,
      })
    }
  }

  if (error) return <CommsErrorBanner error={error} />

  return (
    <EditPageContainer>
      <EditPageLeftStyled>
        <Browser
          getTreeData={getTreeData}
          loading={loading}
          onNameClick={onNameClick}
          treeData={treeData}
        />
      </EditPageLeftStyled>
      <EditPageRight>
        {!activeContent.isFolder &&
          activeContent.id &&
          !activeContent.isImage && (
            <CodeMirror
              extensions={[css(), html()]}
              onChange={onChangeContent}
              value={activeContent.content}
            />
          )}
        {activeContent.isFolder && activeContent.id && (
          <>
            Upload To Folder <SpanActive>{activeContent.name}</SpanActive>:
            <UploadComponent
              label={t('dragndrop.Drag and drop other files here')}
              uploadAssetsFn={uploadAssetsFn}
            />
          </>
        )}
        {activeContent.isImage && <img alt="Preview" src={imageSrc} />}
      </EditPageRight>
    </EditPageContainer>
  )
}

export default CMSFileBrowserPage
