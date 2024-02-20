import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { grid, th } from '@pubsweet/ui-toolkit'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import ProductionWaxEditor from '../../../wax-collab/src/ProductionWaxEditor'
import { DownloadDropdown } from './DownloadDropdown'
import {
  Heading,
  HeadingWithAction,
  HiddenTabs,
  Manuscript,
  ErrorBoundary,
  SectionContent,
  Spinner,
} from '../../../shared'
import { Info } from './styles'
import { ControlsContainer } from '../../../component-manuscripts/src/style'
import AuthorFeedbackForm from '../../../component-author-feedback/src/components/AuthorFeedbackForm'
import UploadAsset from './uploadManager/UploadAsset'
import ReadonlyFormTemplate from '../../../component-review/src/components/metadata/ReadonlyFormTemplate'
import { color } from '../../../../theme'
import AiDesignDemo from '../../../component-ai-assistant/AiDesignDemo'
import { CssAssistantProvider } from '../../../component-ai-assistant/hooks/CssAssistantContext'

const FlexRow = styled.div`
  display: flex;
  gap: ${grid(1)};
  justify-content: space-between;
`

const FormTemplateStyled = styled.div`
  max-height: calc(100vh - 150px);
`

const StyledManuscript = styled(Manuscript)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  width: 100%;
`

const ScrollableTabContent = styled.section`
  background-color: ${color.backgroundA};
  border-radius: ${th('borderRadius')};
  border-top-left-radius: ${th('borderRadius')};
  box-shadow: ${({ theme }) => theme.boxShadow.shades[200]};
  height: calc(100vh - 108px);
  overflow: auto;
  width: calc(100vw - 232px);
`

const LabeledTab = styled.div`
  position: relative;

  &::before {
    background: ${color.brand1.base};
    border-radius: 5px;
    color: white;
    content: 'Beta';
    display: flex;
    font-size: 11px;
    line-height: 1;
    padding: 3px 5px;
    position: absolute;
    right: -42%;
    top: -15px;
  }
`

const Production = ({
  client,
  file,
  articleTemplate,
  displayShortIdAsIdentifier,
  form,
  manuscript,
  currentUser,
  makePdf,
  makeJats,
  submitAuthorProofingFeedback,
  updateManuscript,
  updateTemplate,
  onAssetManager,
  isAuthorProofingVersion,
  isReadOnlyVersion,
  hideEditorSection,
  setHideEditorSection,
}) => {
  const { authorFeedback } = manuscript

  const debouncedSave = useCallback(
    debounce(source => {
      updateManuscript(manuscript.id, { meta: { source } })
    }, 2000),
    [],
  )

  const [cssValue, setCssValue] = useState(articleTemplate.css)

  const [htmlValue, setHtmlValue] = useState(articleTemplate.article)

  const onChangeCss = useCallback(
    debounce(cssContent => {
      setCssValue(cssContent)
      updateTemplate(articleTemplate.id, {
        css: cssContent,
      })
    }, 2000),
    [],
  )

  const onChangeHtml = useCallback(
    debounce(article => {
      setHtmlValue(article)
      updateTemplate(articleTemplate.id, { article })
    }, 2000),
    [],
  )

  useEffect(() => {
    debouncedSave.flush()
    onChangeCss.flush()
    onChangeHtml.flush()
  }, [])

  const { t } = useTranslation()

  const editorSection = {
    content: (
      <>
        {file &&
        file.storedObjects[0].mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
          <SectionContent>
            {manuscript ? (
              <ProductionWaxEditor
                // onBlur={source => {
                //   updateManuscript(manuscript.id, { meta: { source } })
                // }}
                client={client}
                isAuthorProofingVersion={isAuthorProofingVersion}
                manuscriptId={manuscript.id}
                onAssetManager={onAssetManager}
                readonly={isReadOnlyVersion || false}
                saveSource={debouncedSave}
                user={currentUser}
                value={manuscript.meta.source}
              />
            ) : (
              <Spinner />
            )}
          </SectionContent>
        ) : (
          <SectionContent>
            <Info>{t('productionPage.No supported view of the file')}</Info>
          </SectionContent>
        )}
      </>
    ),
    key: 'editor',
    label: `${t('productionPage.Editor')} ${
      isReadOnlyVersion ? t('productionPage.read-only') : ''
    }`,
  }

  const feedbackSection = {
    content: (
      <SectionContent>
        <AuthorFeedbackForm
          currentUser={currentUser}
          isReadOnlyVersion={isReadOnlyVersion}
          manuscript={manuscript}
          setHideEditorSection={setHideEditorSection}
          submitAuthorProofingFeedback={submitAuthorProofingFeedback}
        />
      </SectionContent>
    ),
    key: 'feedback',
    label: t('productionPage.Feedback'),
  }

  const cssPagedJS = {
    content: (
      <ScrollableTabContent>
        <CodeMirror
          extensions={[css()]}
          onChange={onChangeCss}
          value={cssValue}
        />
      </ScrollableTabContent>
    ),
    key: 'cssPagedJs',
    label: t('productionPage.PDF CSS'),
  }

  const htmlTemplate = {
    content: (
      <ScrollableTabContent>
        <CodeMirror
          extensions={[html()]}
          onChange={onChangeHtml}
          value={htmlValue}
        />
      </ScrollableTabContent>
    ),
    key: 'html-template',
    label: t('productionPage.PDF template'),
  }

  const uploadAssets = {
    content: (
      <ScrollableTabContent>
        <UploadAsset
          files={articleTemplate.files}
          groupTemplateId={articleTemplate.groupId}
          tag="isPdf"
        />
      </ScrollableTabContent>
    ),
    key: 'template-assets',
    label: t('productionPage.PDF assets'),
  }

  const manuscriptMetadata = {
    content: (
      <ScrollableTabContent>
        <FormTemplateStyled>
          <ReadonlyFormTemplate
            copyHandleBarsCode
            displayShortIdAsIdentifier={displayShortIdAsIdentifier}
            form={form}
            formData={manuscript}
            manuscript={manuscript}
            // threadedDiscussionProps={threadedDiscussionExtendedProps}
            showEditorOnlyFields
          />
        </FormTemplateStyled>
      </ScrollableTabContent>
    ),
    key: 'manuscript-metadata',
    label: t('productionPage.PDF metadata'),
  }

  const cssAiAssistant = {
    content: (
      <CssAssistantProvider>
        <AiDesignDemo
          currentUser={currentUser}
          manuscript={manuscript}
          saveSource={debouncedSave}
        />
      </CssAssistantProvider>
    ),

    key: 'css-ai-assistant',
    label: <LabeledTab>AiAssistant</LabeledTab>,
  }

  const tabSections = []

  if (isAuthorProofingVersion) {
    // While switching from editing mode to readonly mode the editorSection throws 'Too much recursion' below check avoids the page crash
    if (hideEditorSection) {
      tabSections.push(feedbackSection)
    } else {
      tabSections.push(editorSection, feedbackSection)
    }
  } else {
    tabSections.push(
      editorSection,
      htmlTemplate,
      cssPagedJS,
      uploadAssets,
      manuscriptMetadata,
      cssAiAssistant,
    )

    if (authorFeedback.submitted) tabSections.push(feedbackSection)
  }

  return (
    <StyledManuscript>
      <HeadingWithAction>
        <FlexRow>
          <Heading>
            {isAuthorProofingVersion
              ? t('productionPage.AuthorProofing')
              : t('productionPage.Production')}
          </Heading>
          <ControlsContainer>
            <DownloadDropdown
              isAuthorProofingVersion={isAuthorProofingVersion}
              makeJats={makeJats}
              makePdf={makePdf}
              manuscriptId={manuscript.id}
              manuscriptSource={manuscript.meta.source}
              // manuscriptSource={styleHtmlString(
              //   manuscript.meta.source,
              //   'p {color: blue;}',
              // )}
            />
          </ControlsContainer>
        </FlexRow>
      </HeadingWithAction>
      <ErrorBoundary>
        <HiddenTabs defaultActiveKey="editor" sections={tabSections} />
      </ErrorBoundary>
    </StyledManuscript>
  )
}

export default withRouter(Production)
