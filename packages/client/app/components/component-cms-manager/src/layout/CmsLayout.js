import React from 'react'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Container } from '../../../shared'
import PageHeader from '../components/PageHeader'
import LayoutForm from './LayoutForm'

const CmsLayout = ({
  deleteFile,
  cmsLanguages,
  cmsLayouts,
  createFile,
  flaxSiteUrlForGroup,
  history,
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

  const setInitialData = cmsLayoutData => {
    let initialData = {}
    const currentPartners = cmsLayoutData.partners || []
    const partnerData = currentPartners.filter(partner => partner != null)
    initialData = { ...cmsLayoutData }
    initialData.partners = partnerData.map(
      ({ file, ...restProps }) => restProps, // removing the file object
    )
    // to show the existing image
    initialData.logo = cmsLayoutData.logo ? [cmsLayoutData.logo] : []
    initialData.partnerFiles = partnerData.map(partner => partner.file)
    return initialData
  }

  const onHeaderPageOrderChanged = updatedHeaderInfo => {
    updatePageOrderInfo(updatedHeaderInfo, 'flaxHeaderConfig')
  }

  const onFooterPageOrderChanged = updatedHeaderInfo => {
    updatePageOrderInfo(updatedHeaderInfo, 'flaxFooterConfig')
  }

  return (
    <Container>
      <PageHeader
        history={history}
        leftSideOnly
        mainHeading={t('cmsPage.layout.Layout')}
      />
      <Formik
        initialValues={setInitialData(cmsLayouts[0])} // TODO Deal with full set of layouts by language
        onSubmit={async values => publish(values)}
      >
        {formikProps => {
          return (
            <LayoutForm
              cmsLanguages={cmsLanguages} // TODO Deal with full set of layouts by language
              cmsLayout={cmsLayouts[0]}
              createFile={createFile}
              deleteFile={deleteFile}
              flaxSiteUrlForGroup={flaxSiteUrlForGroup}
              formikProps={formikProps}
              onFooterPageOrderChanged={onFooterPageOrderChanged}
              onHeaderPageOrderChanged={onHeaderPageOrderChanged}
              submitButtonText={submitButtonText}
              triggerAutoSave={
                formData => triggerAutoSave({ language: 'en', ...formData }) // TODO set language correctly
              }
              updateCmsLanguages={updateCmsLanguages}
            />
          )
        }}
      </Formik>
    </Container>
  )
}

export default CmsLayout
