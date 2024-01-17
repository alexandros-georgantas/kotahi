import React from 'react' // { useContext, useState }

import { useQuery } from '@apollo/client'
// import { useTranslation } from 'react-i18next'
import FolderTree, { testData } from 'react-folder-tree'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

import 'react-folder-tree/dist/style.css'

import { Spinner, CommsErrorBanner } from '../../shared'

// import { ConfigContext } from '../../config/src'

import { EditPageContainer, EditPageLeft, EditPageRight } from './style'

import { getCMSPages } from './queries'

const CMSFileBrowserPage = () => {
  // const { t } = useTranslation()
  // const [content, setContent] = useState('')
  // const config = useContext(ConfigContext)

  const { loading, error } = useQuery(getCMSPages)

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  // const onTreeStateChange = (state, event) => console.log(state, event)

  return (
    <EditPageContainer>
      <EditPageLeft>
        <FolderTree
          data={testData}
          // onChange={onTreeStateChange}
          showCheckbox={false}
        />
      </EditPageLeft>
      <EditPageRight>
        <CodeMirror
          extensions={[css(), html()]}
          // onChange={}
          // value={content}
        />
      </EditPageRight>
    </EditPageContainer>
  )
}

export default CMSFileBrowserPage
