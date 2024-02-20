import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import FullWaxEditor from '../wax-collab/src/FullWaxEditor'
import CssAssistant from './CssAssistant'
import { color } from '../../theme'
import { Checkbox } from '../shared'
import { cssStringToObject, srcdoc, initialPagedJSCSS } from './utils'
import SelectionBox from './SelectionBox'
import RefreshIcon from './RefreshIcon'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import ResponsesUi from './ResponsesUi'

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

const CheckBoxes = styled.div`
  border-left: 1px solid #0002;
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.3;
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

const WindowLabel = styled.div`
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
  const { css, htmlSrc, setHtmlSrc } = useContext(CssAssistantContext)

  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(false)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

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

  const updatePreview = () => {
    setPreviewSource(srcdoc(htmlSrc, css))
  }

  return (
    <Root>
      <StyledHeading>
        <CssAssistantUI>
          <ResponsesUi />
          <Assistant
            enabled
            placeholder="Type here how your article should look..."
            stylesFromSource={cssStringToObject(initialPagedJSCSS)}
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
          </span>
        </CheckBoxes>
      </StyledHeading>
      <WindowsContainer>
        <StyledWindow $show={showEditor}>
          <WindowLabel>EDITOR</WindowLabel>
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
          <WindowLabel>
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
          </WindowLabel>
          <PreviewIframe srcDoc={previewSource} title="pdf-preview" />
        </StyledWindow>
      </WindowsContainer>
    </Root>
  )
}

export default AiDesignDemo
