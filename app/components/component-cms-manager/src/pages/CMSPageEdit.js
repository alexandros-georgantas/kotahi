import React, { useEffect, useState } from 'react'

import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { grid } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import CMSPageEditForm from './CMSPageEditForm'

import { FullWidthAndHeightContainer } from '../style'
import { languagesLabels } from '../../../../i18n/index'
import { HiddenTabsContainer, TabContainer, Tab } from '../../../shared'

const Tabs = styled.div`
  display: flex;
  margin-bottom: ${grid(1)};
  margin-top: ${grid(1)};
`

const CMSPageEdit = ({
  isNewPage,
  cmsPage,
  cmsLayout,
  updatePageDataQuery,
  rebuildFlaxSiteQuery,
  createNewCMSPage,
  showPage,
  deleteCMSPage,
  flaxSiteUrlForGroup,
  curLang,
  setCurLang,
  selectedLanguages,
  setSelectedLanguages,
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!selectedLanguages.length) return
    setCurLang(selectedLanguages[0])
  }, [selectedLanguages])

  useEffect(() => {
    if (!cmsLayout) return
    setSelectedLanguages(cmsLayout.languages)
  }, [cmsLayout])

  const changeCurLang = lang => {
    setCurLang(lang)
  }

  const [customFormErrors, setCustomFormErrors] = useState({})

  const [submitButtonState, setSubmitButtonState] = useState({
    state: null,
    text: t('cmsPage.pages.Publish'),
  })

  const autoSaveData = async (id, data) => {
    if (isNewPage) {
      return
    }

    const inputData = { ...data, edited: new Date() }
    await updatePageDataQuery({
      variables: { id, input: inputData },
    })
  }

  const publish = async formData => {
    setSubmitButtonState({
      state: 'pending',
      text: t('cmsPage.pages.Saving data'),
    })
    const timeStamp = new Date()

    const inputData = {
      title: cmsPage.title,
      content: cmsPage.content,
      url: formData.url,
      published: timeStamp,
    }

    await updatePageDataQuery({
      variables: {
        id: cmsPage.id,
        input: inputData,
      },
    })

    setSubmitButtonState({
      state: 'pending',
      text: t('cmsPage.pages.Rebuilding'),
    })
    await rebuildFlaxSiteQuery({
      variables: {
        params: JSON.stringify({
          path: 'pages',
        }),
      },
    })
    setSubmitButtonState({
      state: 'success',
      text: t('cmsPage.pages.Published'),
    })
  }

  const createNewPage = async formData => {
    const inputData = {
      title: cmsPage.title,
      content: cmsPage.content,
      url: formData.url,
    }

    const newCMSPageResults = await createNewCMSPage({
      variables: {
        input: inputData,
      },
    })

    const newCmsPage = newCMSPageResults.data.createCMSPage

    if (newCmsPage.success) {
      return showPage(newCmsPage.cmsPage)
    }

    const errors = {}
    errors[newCmsPage.column] = newCmsPage.errorMessage
    setCustomFormErrors(errors)
    return true
  }

  const onDelete = async currentCMSPage => {
    await deleteCMSPage({
      variables: { id: currentCMSPage.id },
    })
    rebuildFlaxSiteQuery({
      variables: {
        params: JSON.stringify({
          path: 'pages',
        }),
      },
    })
    showPage({ id: '' })
  }

  const resetCustomErrors = () => setCustomFormErrors({})

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

  return (
    <FullWidthAndHeightContainer>
      {cmsLayout?.languages && renderLangTabs()}
      <FullWidthAndHeightContainer>
        <Formik
          initialValues={{
            title: cmsPage.title || '',
            content: cmsPage.content || '',
            url: cmsPage.url || '',
          }}
          onSubmit={async values =>
            isNewPage ? createNewPage(values) : publish(values)
          }
        >
          {formikProps => {
            return (
              <CMSPageEditForm
                autoSaveData={autoSaveData}
                cmsPage={cmsPage}
                curLang={curLang}
                currentValues={formikProps.values}
                customFormErrors={customFormErrors}
                flaxSiteUrlForGroup={flaxSiteUrlForGroup}
                isNewPage={isNewPage}
                onDelete={onDelete}
                onSubmit={formikProps.handleSubmit}
                resetCustomErrors={resetCustomErrors}
                selectedLanguages={selectedLanguages}
                setFieldValue={formikProps.setFieldValue}
                setTouched={formikProps.setTouched}
                submitButtonText={
                  isNewPage ? t('cmsPage.pages.Save') : submitButtonState.text
                }
              />
            )
          }}
        </Formik>
      </FullWidthAndHeightContainer>
    </FullWidthAndHeightContainer>
  )
}

export default CMSPageEdit
