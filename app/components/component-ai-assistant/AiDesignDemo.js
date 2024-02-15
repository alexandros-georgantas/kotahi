import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FullWaxEditor from '../wax-collab/src/FullWaxEditor'
import CssAssistant from './CssAssistant'
import { color } from '../../theme'
import { Checkbox } from '../shared'

const previewSrc = (scope, css) => /* html */ `
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
  <style>
    @page {
      size: A4;
      margin:  20mm;
      border:  1pt solid #0004;

      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        vertical-align: middle;
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
      margin-left:  2cm;
      margin-right:  3cm;
    }

    body {
      column-count:  1;
      column-gap:  20px;

      column-width:  500px;

      column-rule-style: solid;
      column-rule-width:  1px;
      column-rule-color: #ccc;
    }
    body,
    html {
      margin: 0;
    }
      ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #07c15799;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }

    body {
      font-size: 14px;
      line-height: 1.5;
      hyphenate-limit-chars: 8;
    }

    .topbar {
      text-align: right;
      letter-spacing: 0.05ch;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 0 0 8px;
      font-size: 0.8em;
      font-weight: 500;
      display: flex;
    }

    .topbar .journal-name {
      color: var(--color-main);
      margin: 0;
      font-size: 1.2em;
      font-weight: 800;
    }

    .topbar img {
      fill: var(--color-main);
      width: auto;
      max-width: 45mm;
      height: 3em;
      margin-left: 0;
      padding-bottom: 0.3em;
      display: block;
    }

    .topbar svg {
      fill: var(--color-main);
      width: auto;
      max-width: 45mm;
      height: 3em;
      margin-left: 0;
      padding-bottom: 0.3em;
      display: block;
    }

    .topbar .topics {
      text-transform: uppercase;
      text-align: right;
      color: var(--color-main);
      letter-spacing: 0.04ch;
      flex-wrap: wrap;
      justify-content: end;
      gap: 3ch;
      margin: 0;
      padding: 0;
      font-size: 0.8em;
      list-style-type: none;
      display: flex;
    }

    .svg-icon.email {
      color: var(--color-main);
      max-height: 20px;
    }

    .chapter {
      break-before: always;
      page: blank;
    }

    .pagedjs_left_page .pagedjs_margin-top-left .pagedjs_margin-content {
      width: auto;
      background-color: #ffd2b5;
      color: #fe4017;
      padding:  2mm  5mm;
    }
    ${css || ''}
  </style>
</head>
<body>
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
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: column;
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
  height: 90%;
  margin-top: -1px;
  overflow: hidden;
  width: 100%;
`

const EditorContainer = styled.div`
  background: #eee;
  display: flex;
  height: 100%;
  overflow: auto;
  padding: ${p => (p.$show ? '20px' : '0')};
  transition: width 0.5s;
  width: ${p => (p.$show ? '100%' : '0')};

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #07c15799;
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
  transform-origin: right;
  transition: width 0.5s;
  width: ${p => (p.$show ? '100%' : '0')};
`

const StyledCheckbox = styled(Checkbox)``

function AiDesignDemo({ saveSource, currentUser, manuscript }) {
  const [scope, setScope] = useState(null)
  const [css, setCss] = useState(null)
  const [preview, setPreview] = useState(null)
  const [previewOnChange, setPreviewOnChange] = useState(false)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    previewOnChange && scope?.outerHTML && setPreview(previewSrc(scope, css))
  }, [scope, css])

  useEffect(() => {
    showPreview && scope?.outerHTML && setPreview(previewSrc(scope, css))
  }, [showPreview])

  return (
    <Wrapper>
      <StyledHeading>
        <StyledCssAssistant
          enabled
          placeholder="Type here how your article should look..."
          scope={scope}
          setCss={setCss}
        />
        <span
          style={{
            color: color.brand1.base(),
            fontSize: '14px',
            lineHeight: '1.3',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            padding: '5px 10px',
            borderTop: '1px solid #0002',
          }}
        >
          <StyledCheckbox
            checked={previewOnChange}
            handleChange={e => setPreviewOnChange(!previewOnChange)}
            label="Live preview"
            style={{ margin: 0 }}
          />
          <StyledCheckbox
            checked={showEditor}
            handleChange={e => setShowEditor(!showEditor)}
            label="Show Editor"
            style={{ margin: 0 }}
          />
          <StyledCheckbox
            checked={showPreview}
            handleChange={e => setShowPreview(!showPreview)}
            label="Show Preview"
            style={{ margin: 0 }}
          />
        </span>
      </StyledHeading>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <EditorContainer $show={showEditor}>
          <FullWaxEditor
            getActiveViewDom={setScope}
            readonly
            saveSource={saveSource}
            user={currentUser}
            value={manuscript.meta.source}
          />
        </EditorContainer>
        <PreviewIframe
          $show={showPreview}
          srcDoc={preview}
          title="pdf-preview"
        />
      </div>
    </Wrapper>
  )
}

export default AiDesignDemo
