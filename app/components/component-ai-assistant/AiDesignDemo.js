import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FullWaxEditor from '../wax-collab/src/FullWaxEditor'
import CssAssistant from './CssAssistant'
import { color } from '../../theme'
import { Checkbox } from '../shared'
import { cssStringToObject } from './utils/helpers'

const previewOnlyCSS = /* css */ `  
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

const initialPagedJSCSS = /* css */ ` 
  :root {
  --page-counter-color: #777
  }
  @page {
      size: A4;
      margin:  20mm;
      border:  1pt solid #0004;
      padding: 20mm;

      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        vertical-align: middle;
        color: var(--page-counter-color);
        text-align: center;
        border-top:  1pt solid #0004; 
        padding-top:  5mm;
      }
    }

    @page :first {
      margin:  3cm;
    }

    @page :left {
      margin-left:  3cm;
      margin-right:  2cm;
    }

    @page :right {
      margin-left:  3cm;
      margin-right:  3cm;
    }

    #body {
      column-count:  1;
      column-gap:  20px;
      column-width:  100%;
      column-rule-style: solid;
      column-rule-width:  1px;
      column-rule-color: #ccc;
      font-size: 14px;
      line-height: 1.5;
      hyphenate-limit-chars: 8;
    }
    body,
    html {
      margin: 0;
    }
`

const generateSrcDoc = (scope, css) => /* html */ `
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
  <style>
    ${previewOnlyCSS}
    ${css || ''}
  </style>
</head>
<body id="body">
  ${scope.outerHTML}
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const scopeIsReady = document.getElementById("css-assistant-scope")
      scopeIsReady && PagedPolyfill.preview(scopeIsReady);
    });
  </script>
</body>
</html>
  `

const StyledCssAssistant = styled(CssAssistant)`
  margin: 10px 0;
`

const StyledHeading = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  scrollbar-color: #07c15799;
  scrollbar-width: thin;
  width: 100%;
`

const Wrapper = styled.div`
  border: 1px solid #0002;
  border-radius: 0 8px 8px 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: -1px;
  overflow: hidden;
  width: 100%;
`

const EditorContainer = styled.div`
  background: #eee;
  display: flex;
  height: 100%;
  overflow: auto;
  padding: 40px;
  transition: width 0.5s;
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
  height: 100%;
  width: 100%;
`

const CheckBoxes = styled.div`
  border-left: 1px solid #0002;
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.3;
  padding: 5px 10px;
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
  background-color: ${color.brand1.base}88;
  box-shadow: 0 0 2px #0009;
  color: white;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  justify-content: space-between;
  padding: 2px 10px;
  text-shadow: 0 0 2px #0009;
  z-index: 99;
`

const WindowDivision = styled.div`
  background-color: #0004;
  height: 100%;
  width: 3px;
  z-index: 999;
`

const StyledCheckbox = styled(Checkbox)``

function AiDesignDemo({ saveSource, currentUser, manuscript }) {
  const [scope, setScope] = useState(null)
  const [css, setCss] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(false)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    livePreview &&
      scope?.outerHTML &&
      setPreviewSource(generateSrcDoc(scope, css))
  }, [scope, css])

  useEffect(() => {
    showPreview &&
      scope?.outerHTML &&
      setPreviewSource(generateSrcDoc(scope, css))
    !showPreview && setShowEditor(true)
  }, [showPreview])

  return (
    <Wrapper>
      <StyledHeading>
        <StyledCssAssistant
          enabled
          placeholder="Type here how your article should look..."
          scope={scope}
          setCss={setCss}
          stylesFromSource={cssStringToObject(initialPagedJSCSS)}
        />
        <CheckBoxes>
          <StyledCheckbox
            checked={showEditor || (!showPreview && !showEditor)}
            handleChange={e => setShowEditor(showPreview ? !showEditor : true)}
            label="Show Editor"
            style={{ margin: 0 }}
          />
          <StyledCheckbox
            checked={showPreview}
            handleChange={e => setShowPreview(!showPreview)}
            label="Show Preview"
            style={{ margin: 0 }}
          />
        </CheckBoxes>
      </StyledHeading>
      <WindowsContainer>
        <StyledWindow $show={showEditor}>
          <WindowLabel>EDITOR</WindowLabel>
          <EditorContainer>
            <FullWaxEditor
              getActiveViewDom={setScope}
              readonly
              saveSource={saveSource}
              user={currentUser}
              value={manuscript.meta.source}
            />
          </EditorContainer>
        </StyledWindow>
        {showEditor && showPreview && <WindowDivision />}
        <StyledWindow $show={showPreview}>
          <WindowLabel>
            <span>PDF PREVIEW:</span>
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
    </Wrapper>
  )
}

export default AiDesignDemo
