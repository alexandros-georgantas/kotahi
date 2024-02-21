import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import FullWaxEditor from '../wax-collab/src/FullWaxEditor'
import CssAssistant from './CssAssistant'
import { color } from '../../theme'
import { Checkbox } from '../shared'
import { srcdoc, initialPagedJSCSS } from './utils'
import SelectionBox from './SelectionBox'
import RefreshIcon from './RefreshIcon'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import ResponsesUi, { ChatBox } from './ResponsesUi'

const Assistant = styled(CssAssistant)`
  margin: 10px 0;
`

const CssAssistantUI = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0 5px;
`

const StyledHeading = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0px 0 10px;
  scrollbar-color: #07c15799;
  scrollbar-width: thin;
  width: 100%;
`

const Root = styled.div`
  border: 1px solid #0002;
  border-radius: 0 8px 8px 8px;
  height: 100%;
  margin-top: -1px;
  overflow: hidden;
  width: 100%;
`

const EditorContainer = styled.div`
  background: #eee;
  display: flex;
  height: 89%;
  overflow: auto;
  padding: 40px;
  position: relative;
  transition: width 0.5s;
  user-select: none;
  width: 100%;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${color.brand1.base}88;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }
`

const PreviewIframe = styled.iframe`
  display: flex;
  height: 89%;
  width: 100%;
`

const ChatHistoryContainer = styled.div`
  background: #ddd;
  display: flex;
  flex-direction: column;
  height: 89%;
  overflow: auto;
  padding: 40px;
  position: relative;
  transition: width 0.5s;
  user-select: none;
  width: 100%;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #777;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }
`

const CheckBoxes = styled.div`
  border-left: 1px solid #0002;
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.3;
  min-width: 150px;
  padding: 0;

  > :first-child {
    border-bottom: 1px solid #0002;
    color: ${color.brand1.base};
    font-size: 11px;
    padding: 2px 5px 0;
    width: 100%;
  }

  > :nth-child(2) {
    padding: 5px 10px;
  }
`

const WindowsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const StyledWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: width 0.5s ease;
  width: ${p => (p.$show ? '100%' : '0')};
`

const WindowHeading = styled.div`
  background-color: #f6f6f6;
  box-shadow: 0 0 2px #0009;
  color: #777;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  justify-content: space-between;
  padding: 2px 10px;
  white-space: nowrap;
  /* text-shadow: 0 0 2px #0004; */
  z-index: 99;
`

const WindowDivision = styled.div`
  background-color: #0004;
  height: 100%;
  width: 3px;
  z-index: 999;
`

const StyledRefreshButton = styled.span`
  align-items: center;
  display: flex;
  gap: 8px;

  button {
    background: #fff0;
    border-radius: 5px;
    cursor: pointer;
    height: 20px;
    outline: 1px solid #777;
    padding: 1px 1px 0;
    width: 21px;

    &:hover {
      background: ${color.brand1.base}55;
    }
  }

  svg {
    fill: #777;
    height: 11px;
    width: 11px;
  }
`

const StyledCheckbox = styled(Checkbox)``

function AiDesignDemo({ saveSource, currentUser, manuscript }) {
  const {
    css,
    htmlSrc,
    setHtmlSrc,
    selectedCtx,
    setSelectedCtx,
    setSelectedNode,
    context,
  } = useContext(CssAssistantContext)

  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(false)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    showPreview &&
      livePreview &&
      htmlSrc?.outerHTML &&
      setPreviewSource(srcdoc(htmlSrc, css))
  }, [htmlSrc, css])

  useEffect(() => {
    showPreview && htmlSrc?.outerHTML && setPreviewSource(srcdoc(htmlSrc, css))
    !showPreview && setShowEditor(true)
  }, [showPreview])

  useEffect(() => {
    if (!showEditor) {
      setSelectedCtx(context.current.find(ctx => ctx.node === htmlSrc))
      setSelectedNode(htmlSrc)
    }
  }, [showEditor])

  const updatePreview = () => {
    setPreviewSource(srcdoc(htmlSrc, css))
  }

  return (
    <Root>
      <StyledHeading>
        <CssAssistantUI>
          <ResponsesUi forceHide={showChat} />
          <Assistant
            enabled
            placeholder="Type here how your article should look..."
            stylesFromSource={initialPagedJSCSS}
          />
        </CssAssistantUI>
        <CheckBoxes>
          <strong>VIEW:</strong>
          <span>
            <StyledCheckbox
              checked={showEditor || (!showPreview && !showEditor)}
              handleChange={e =>
                setShowEditor(showPreview ? !showEditor : true)
              }
              label="Editor"
              style={{ margin: 0 }}
            />
            <StyledCheckbox
              checked={showPreview}
              handleChange={e => setShowPreview(!showPreview)}
              label="PDF Preview"
              style={{ margin: 0 }}
            />
            <StyledCheckbox
              checked={showChat}
              handleChange={e => setShowChat(!showChat)}
              label="Chat History"
              style={{ margin: 0 }}
            />
          </span>
        </CheckBoxes>
      </StyledHeading>
      <WindowsContainer>
        <StyledWindow $show={showChat} style={{ maxWidth: '30%' }}>
          <WindowHeading>CHAT HISTORY</WindowHeading>
          <ChatHistoryContainer>
            {selectedCtx?.history?.length > 0 ? (
              selectedCtx.history.map(({ role, content }) => (
                <span
                  key={content}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '10px',
                  }}
                >
                  {role === 'assistant' ? (
                    <ChatBox
                      $pointerOnBottom
                      content={content}
                      header={<strong>Kotahi AI PDF designer</strong>}
                      position="inherit"
                      skew="-20deg"
                    />
                  ) : (
                    <ChatBox
                      $pointerOnBottom
                      $pointerOnRight
                      content={content}
                      header={
                        <strong>{`${currentUser?.username || 'You'}:`}</strong>
                      }
                      position="inherit"
                      skew="20deg"
                    />
                  )}
                </span>
              ))
            ) : (
              <span
                style={{
                  color: '#777',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '5px',
                  textAlign: 'center',
                }}
              >
                {`Make your first prompt related to ${
                  selectedCtx.node === htmlSrc
                    ? 'the article'
                    : `this <${selectedCtx.tagName || 'selected'}> element`
                }`}
              </span>
            )}
          </ChatHistoryContainer>
        </StyledWindow>
        {showChat && (showEditor || showPreview) && <WindowDivision />}

        <StyledWindow $show={showEditor}>
          <WindowHeading>EDITOR</WindowHeading>
          <EditorContainer>
            <FullWaxEditor
              getActiveViewDom={setHtmlSrc}
              readonly
              saveSource={saveSource}
              user={currentUser}
              value={manuscript.meta.source}
            />
            <SelectionBox />
          </EditorContainer>
        </StyledWindow>
        {showEditor && showPreview && <WindowDivision />}
        <StyledWindow $show={showPreview}>
          <WindowHeading>
            <StyledRefreshButton>
              <button onClick={updatePreview} type="submit">
                <RefreshIcon />
              </button>
              <span>PDF PREVIEW:</span>
            </StyledRefreshButton>
            <StyledCheckbox
              checked={livePreview}
              handleChange={e => setLivePreview(!livePreview)}
              label="Live preview"
              labelBefore
              style={{ margin: 0 }}
            />
          </WindowHeading>
          <PreviewIframe srcDoc={previewSource} title="pdf-preview" />
        </StyledWindow>
      </WindowsContainer>
    </Root>
  )
}

export default AiDesignDemo
