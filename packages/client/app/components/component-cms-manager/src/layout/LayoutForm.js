import React from 'react'
import { SectionContent, PaddedContent } from '../../../shared'
import Header from './Header'
import Branding from './Branding'
import Footer from './Footer'

const LayoutForm = ({
  language,
  formikProps,
  cmsLayout,
  onHeaderPageOrderChanged,
  onFooterPageOrderChanged,
  createFile,
  deleteFile,
  updateCmsLayout,
}) => {
  const renderBranding = () => {
    return (
      <Branding
        cmsLayout={cmsLayout}
        createFile={createFile}
        deleteFile={deleteFile}
        formikProps={formikProps}
        language={language}
        updateCmsLayout={delta =>
          updateCmsLayout({ languageLayouts: [{ ...delta, id: cmsLayout.id }] })
        }
      />
    )
  }

  const renderHeader = () => {
    return (
      <Header
        cmsLayout={cmsLayout}
        formikProps={formikProps}
        language={language}
        onPageOrderUpdated={onHeaderPageOrderChanged}
      />
    )
  }

  const renderFooter = () => {
    return (
      <Footer
        cmsLayout={cmsLayout}
        createFile={createFile}
        deleteFile={deleteFile}
        formikProps={formikProps}
        language={language}
        onPageOrderUpdated={onFooterPageOrderChanged}
        updateCmsLayout={updateCmsLayout}
      />
    )
  }

  return (
    <SectionContent>
      <PaddedContent>
        {renderBranding()}
        <hr />
        {renderHeader()}
        <hr />
        {renderFooter()}
      </PaddedContent>
    </SectionContent>
  )
}

export default LayoutForm
