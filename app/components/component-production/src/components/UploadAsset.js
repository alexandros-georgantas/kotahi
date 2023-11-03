/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState } from 'react'
import { grid, th } from '@pubsweet/ui-toolkit'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { color } from '../../../../theme'
// import { Placeholder } from '../../../component-dashboard/src/style'
// import FileRow from './FileRow'
import {
  Container,
  SectionContent,
  SectionRow,
  Icon,
  Spinner,
} from '../../../shared'
// import { HeadingCell } from './styles'

const Message = styled.div`
  align-items: center;
  color: inherit;
  display: flex;
  justify-content: center;
  width: 100%;

  svg {
    margin-left: ${grid(1)};
  }
`

const UploadAssetContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const DropZoneContainer = styled.div`
  align-items: center;
  background-color: #fafafa;
  border-color: #eeeeee;
  border-radius: 2px;
  border-style: dashed;
  border-width: 2px;
  color: #bdbdbd;
  display: flex;
  flex: 1;
  flex-direction: column;
  outline: none;
  padding: 20px;
  transition: border 0.24s ease-in-out;
`

const Button = styled.button`
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const UlFiles = styled.ul`
  height: 600px;
  overflow-y: auto;
`

export const FileTableStyled = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  width: 100%;
`

export const FilesRow = styled.div`
  align-items: center;
  background-color: ${color.backgroundA};
  border-top: 1px solid ${color.gray90};
  column-gap: ${grid(2)};
  display: flex;
  flex-direction: row;
  line-height: 1.4em;
  text-align: left;
  width: 100%;

  &:first-child {
    border-top: none;
    padding: ${grid(0.5)} ${grid(2)};
  }

  &:not(:first-child) {
    padding: ${grid(1.5)} ${grid(2)};
  }
`

const UploadAsset = ({ files, groupTemplateId }) => {
  const { t } = useTranslation()
  const [showSpinner, setShowSpinner] = useState(false)
  const [filesState, setFilesState] = useState(files)

  const uploadAssetsFn = useCallback(async acceptedFiles => {
    const body = new FormData()

    acceptedFiles.forEach(f => body.append('files', f))

    body.append('groupTemplateId', groupTemplateId)
    let result = await fetch('/api/uploadAsset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body,
    })

    result = await result.json()
    setFilesState([...result])
    setShowSpinner(false)
  }, [])

  const onDrop = useCallback(async acceptedFiles => {
    setShowSpinner(true)
    uploadAssetsFn(acceptedFiles)
  }, [])

  const onCopyAsImage = file => {
    return () =>
      navigator.clipboard.writeText(
        `<img data-name="${file.name}" data-id="${file.id}" src="${file.storedObjects[0].url}" />`,
      )
  }

  const onCopyAsUrl = file => {
    return () => navigator.clipboard.writeText(file.storedObjects[0].url)
  }

  const onCopyAsScriptLink = file => {
    return () =>
      navigator.clipboard.writeText(
        `<script data-name="${file.name}" data-id="${file.id}" src="${file.storedObjects[0].url}"></script>`,
      )
  }

  const onCopyAsCssLink = file => {
    return () =>
      navigator.clipboard.writeText(
        `<link data-name="${file.name}" data-id="${file.id}" rel="stylesheet" href="${file.storedObjects[0].url}" />`,
      )
  }

  const onCopyAsFont = file => {
    return () =>
      navigator.clipboard.writeText(
        `<link data-name="${file.name}" data-id="${file.id}" rel="preload" as="font" href="${file.storedObjects[0].url}" />`,
      )
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // const columnsProps = [
  //   {
  //     name: 'id',
  //     centered: false,
  //     title: 'ID',
  //     component: ({ file }) => {
  //       return file && file.id
  //     },
  //   },
  //   {
  //     name: 'created',
  //     centered: false,
  //     title: 'Created',
  //     component: ({ file }) => {
  //       return file && file.created
  //     },
  //   },
  //   {
  //     name: 'name',
  //     centered: false,
  //     title: 'Name',
  //     component: ({ file }) => {
  //       return file && file.name
  //     },
  //   },
  // ]

  return (
    <UploadAssetContainer>
      <SectionContent>
        <SectionRow key="upload-asset">
          <section>
            {!showSpinner ? (
              <DropZoneContainer {...getRootProps()}>
                <input {...getInputProps()} />
                <Message>
                  <>
                    {t('dragndrop.Drag and drop your files here')}
                    <Icon color={color.brand1.base()} inline>
                      file-plus
                    </Icon>
                  </>
                </Message>
              </DropZoneContainer>
            ) : (
              <Spinner />
            )}
          </section>
        </SectionRow>
        <SectionRow key="files">
          Asset Files:
          <UlFiles>
            {filesState.map(file => (
              <li key={file.storedObjects[0].key}>
                {file.name} -{' '}
                <Button onClick={onCopyAsCssLink(file)}>Copy Css</Button>{' '}
                <Button onClick={onCopyAsScriptLink(file)}>Copy Script</Button>{' '}
                <Button onClick={onCopyAsImage(file)}>Copy Image</Button>{' '}
                <Button onClick={onCopyAsFont(file)}>Copy Font</Button>
                <Button onClick={onCopyAsUrl(file)}>Copy URL</Button>
              </li>
            ))}
          </UlFiles>
        </SectionRow>
        {/* <SectionRow key="files">
          <FileTableStyled>
            <FilesRow>
              {columnsProps.map(info => (
                <HeadingCell key={info.name}>{info.title}</HeadingCell>
              ))}
            </FilesRow>
            {filesState.length === 0 ? (
              <Placeholder>
                {t('manuscriptsTable.No matching manuscripts were found')}
              </Placeholder>
            ) : (
              filesState.map((file, key) => (
                <FileRow
                  columnDefinitions={columnsProps}
                  file={file}
                  key={file.id}
                />
              ))
            )}
          </FileTableStyled>
        </SectionRow> */}
      </SectionContent>
    </UploadAssetContainer>
  )
}

export default UploadAsset
