import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import {
  Container,
  HiddenTabs,
  SectionContent,
  PaddedContent,
} from '../../../shared'
import PageHeader from '../components/PageHeader'
import LayoutForm from './LayoutForm'
import LanguageList from './LanguageList'
import SiteStatus from './SiteStatus'
import PublishStatus from '../components/PublishStatus'
import { ActionButtonContainer, FormActionButton } from '../style'
import { languagesLabels } from '../../../../i18n/index'

const CmsLayouts = ({
  deleteFile,
  cmsLayout,
  createFile,
  flaxSiteUrlForGroup,
  history,
  privatePublishingHash,
  publish,
  publishingStatus,
  triggerAutoSave,
  updateCmsLanguages,
  updatePageOrderInfo,
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

    cmsLayout.languageLayouts.forEach(langLayout => {
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

  const getSections = (langs, formikProps) => {
    return langs.map(lang => ({
      label: languagesLabels.find(x => x.value === lang)?.label ?? lang,
      key: lang,
      content: (
        <LayoutForm
          cmsLayout={formikProps.values[lang]}
          createFile={createFile}
          deleteFile={deleteFile}
          formikProps={formikProps}
          triggerAutoSave={
            formData => triggerAutoSave({ language: 'en', ...formData }) // TODO set language correctly
          }
        />
      ),
    }))
  }

  return (
    <Container>
      <PageHeader
        history={history}
        leftSideOnly
        mainHeading={t('cmsPage.layout.Layout')}
      />
      <SectionContent>
        <PaddedContent>
          <LanguageList
            languages={cmsLayout.languageLayouts.map(x => x.language)}
            systemLanguages={['en', 'ru-RU', 'es-LA', 'fr']}
            updateLanguages={updateCmsLanguages}
          />
        </PaddedContent>
      </SectionContent>
      <Formik initialValues={initialData} onSubmit={values => publish(values)}>
        {formikProps => (
          <Form>
            <HiddenTabs
              defaultActiveKey={cmsLayout.languageLayouts[0].language}
              sections={getSections(
                cmsLayout.languageLayouts.map(x => x.language),
                formikProps,
              )}
            />
            <SectionContent>
              <PaddedContent>
                <SiteStatus
                  flaxSiteUrlForGroup={flaxSiteUrlForGroup}
                  isPrivate={cmsLayout.isPrivate /* TODO more sensible */}
                  privatePublishingHash={privatePublishingHash}
                  triggerAutoSave={triggerAutoSave}
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
              <PublishStatus cmsComponent={cmsLayout} />
            </ActionButtonContainer>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default CmsLayouts
