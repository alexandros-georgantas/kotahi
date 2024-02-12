import React, { useState } from 'react'
import styled from 'styled-components'
import FullWaxEditor from '../wax-collab/src/FullWaxEditor'
import CssAssistant from './CssAssistant'

const StyledCssAssistant = styled(CssAssistant)``

const StyledHeading = styled.div`
  background-color: #fff;
  padding: 10px;
  width: 100%;
`

function AiDesignDemo({ saveSource, currentUser, manuscript }) {
  const [scope, setScope] = useState(null)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <StyledHeading>
        <StyledCssAssistant enabled scope={scope} />
      </StyledHeading>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '80%',
          borderBottom: '1px solid #0004',
        }}
      >
        <FullWaxEditor
          getActiveViewDom={setScope}
          readonly
          saveSource={saveSource}
          user={currentUser}
          value={manuscript.meta.source}
        />
      </div>
    </div>
  )
}

export default AiDesignDemo
