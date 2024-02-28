import React, { useEffect, useState } from 'react'

import { grid } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import {
  SectionContent,
  PaddedContent,
  HiddenTabsContainer,
  TabContainer,
  Tab,
} from '../../../shared'
import { ActionButtonContainer, FormActionButton } from '../style'
import PublishStatus from '../components/PublishStatus'

import Header from './Header'
import Branding from './Branding'
import Footer from './Footer'
import Langauges from './Languages'
import { languagesLabels } from '../../../../i18n/index'

const Tabs = styled.div`
  display: flex;
  margin-bottom: ${grid(-3)};
  margin-top: ${grid(1)};
`

const LayoutForm = ({
  formikProps,
  cmsLayout,
  submitButtonText,
  onHeaderPageOrderChanged,
  onFooterPageOrderChanged,
  createFile,
  deleteFile,
  triggerAutoSave,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [curLang, setCurLang] = useState()

  useEffect(() => {
    if (!selectedLanguages.length) return
    setCurLang(selectedLanguages[0])
  }, [selectedLanguages])

  const changeCurLang = lang => {
    setCurLang(lang)
  }

  const renderLangauges = () => {
    return (
      <SectionContent>
        <PaddedContent>
          <Langauges
            cmsLayout={cmsLayout}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            triggerAutoSave={triggerAutoSave}
          />
        </PaddedContent>
      </SectionContent>
    )
  }

  const renderLangTabs = () => {
    return (
      <HiddenTabsContainer sticky={false}>
        <Tabs>
          {selectedLanguages.map((lang, index) => (
            <TabContainer key={lang}>
              <Tab active={curLang === lang}>
                {/* eslint-disable-next-line */}
                <div onClick={() => changeCurLang(lang)}>
                  {languagesLabels.find(label => label.value === lang).label}
                </div>
              </Tab>
            </TabContainer>
          ))}
        </Tabs>
      </HiddenTabsContainer>
    )
  }

  const renderBranding = () => {
    return (
      <>
        <SectionContent>
          <PaddedContent>
            <Branding
              cmsLayout={cmsLayout}
              createFile={createFile}
              curLang={curLang}
              deleteFile={deleteFile}
              formikProps={formikProps}
              triggerAutoSave={triggerAutoSave}
            />
          </PaddedContent>
        </SectionContent>
      </>
    )
  }

  const renderHeader = () => {
    return (
      <SectionContent>
        <PaddedContent>
          <Header
            cmsLayout={cmsLayout}
            curLang={curLang}
            onPageOrderUpdated={onHeaderPageOrderChanged}
          />
        </PaddedContent>
      </SectionContent>
    )
  }

  const renderFooter = () => {
    return (
      <SectionContent>
        <PaddedContent>
          <Footer
            cmsLayout={cmsLayout}
            createFile={createFile}
            curLang={curLang}
            deleteFile={deleteFile}
            formikProps={formikProps}
            onPageOrderUpdated={onFooterPageOrderChanged}
            triggerAutoSave={triggerAutoSave}
          />
        </PaddedContent>
      </SectionContent>
    )
  }

  return (
    <div>
      {renderLangauges()}
      {renderLangTabs()}
      {renderBranding()}
      {renderHeader()}
      {renderFooter()}

      <ActionButtonContainer>
        <div>
          <FormActionButton
            onClick={formikProps.handleSubmit}
            primary
            type="button"
          >
            {submitButtonText}
          </FormActionButton>
        </div>
        <PublishStatus cmsComponent={cmsLayout} />
      </ActionButtonContainer>
    </div>
  )
}

export default LayoutForm
