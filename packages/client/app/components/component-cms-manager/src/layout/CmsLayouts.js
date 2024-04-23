import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import { Edit } from 'react-feather'
import styled from 'styled-components'
import {
  Container,
  HiddenTabs,
  SectionContent,
  PaddedContent,
  Action,
  ActionButton,
} from '../../../shared'
import PageHeader from '../components/PageHeader'
import LayoutForm from './LayoutForm'
import LanguageList from './LanguageList'
import SiteStatus from './SiteStatus'
import PublishStatus from '../components/PublishStatus'
import { ActionButtonContainer, FormActionButton } from '../style'
import { languagesLabels } from '../../../../i18n/index'
import { color } from '../../../../theme'
import Modal from '../../../component-modal/src/Modal'

const EditIcon = styled(Edit)`
  stroke: ${color.brand1.base};
`

const Header = styled(PageHeader)`
  padding-bottom: 8px;
`

const EditLanguagesControl = ({ languages, updateCmsLanguages }) => {
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  return (
    <>
      <Action
        onClick={() => setModalIsOpen(true)}
        title="Edit CMS languages..."
      >
        <EditIcon height="18px" />
      </Action>
      <Modal
        hideCloseButton
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        rightActions={
          <ActionButton onClick={() => setModalIsOpen(false)}>OK</ActionButton>
        }
        subtitle={t('cmsPage.layout.LanguagesDesc')}
        title={t('cmsPage.layout.Choose languages')}
      >
        <LanguageList
          languages={languages}
          systemLanguages={['en', 'ru-RU', 'es-LA', 'fr']}
          updateLanguages={updateCmsLanguages}
        />
      </Modal>
    </>
  )
}

const CmsLayouts = ({
  deleteFile,
  cmsLayoutSet,
  createFile,
  flaxSiteUrlForGroup,
  history,
  publish,
  publishingStatus,
  updateCmsLanguages,
  updateCmsLayout,
}) => {
  const { t } = useTranslation()
  let submitButtonText

  switch (publishingStatus) {
    case 'saving':
      submitButtonText = t('cmsPage.layout.Saving data')
      break
    case 'rebuilding':
      submitButtonText = t('cmsPage.layout.Rebuilding Site')
      break
    case 'published':
      submitButtonText = t('cmsPage.layout.Published')
      break
    default:
      submitButtonText = t('cmsPage.layout.Publish')
  }

  const initialData = useMemo(() => {
    const result = {}

    cmsLayoutSet.languageLayouts.forEach(langLayout => {
      const currentPartners = langLayout.partners || []
      const partnerData = currentPartners.filter(partner => partner != null)
      result[langLayout.language] = {
        ...langLayout,
        partners: partnerData.map(({ file, ...restProps }) => restProps), // removing the file object
        partnerFiles: partnerData.map(partner => partner.file),
        logo: langLayout.logo ? [langLayout.logo] : [], // to show the existing image
      }
    })

    return result
  }, [])

  const getSections = formikProps => {
    return Object.entries(formikProps.values).map(([lang, layout]) => ({
      label: languagesLabels.find(x => x.value === lang)?.label ?? lang,
      key: lang,
      content: (
        <LayoutForm
          cmsLayout={layout}
          createFile={createFile}
          deleteFile={deleteFile}
          formikProps={formikProps}
          updateCmsLayout={updateCmsLayout}
        />
      ),
    }))
  }

  const languages = cmsLayoutSet.languageLayouts.map(x => x.language)

  return (
    <Container>
      <Header
        history={history}
        leftSideOnly
        mainHeading={t('cmsPage.layout.Layout')}
      />
      <Formik initialValues={initialData} onSubmit={values => publish(values)}>
        {formikProps => (
          <Form>
            <HiddenTabs
              defaultActiveKey={languages[0]}
              extraControls={
                <EditLanguagesControl
                  languages={languages}
                  updateCmsLanguages={updateCmsLanguages}
                />
              }
              sections={getSections(formikProps)}
            />
            <SectionContent>
              <PaddedContent>
                <SiteStatus
                  flaxSiteUrlForGroup={flaxSiteUrlForGroup}
                  isPrivate={cmsLayoutSet.isPrivate}
                  privatePublishingHash={cmsLayoutSet.hexCode}
                  updateCmsLayout={updateCmsLayout}
                />
              </PaddedContent>
            </SectionContent>
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
              <PublishStatus cmsComponent={cmsLayoutSet} />
            </ActionButtonContainer>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default CmsLayouts
