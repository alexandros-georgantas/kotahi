import React from 'react'
import { SectionContent, PaddedContent } from '../../../shared'
import Header from './Header'
import Branding from './Branding'
import Footer from './Footer'

const LayoutForm = ({
  formikProps,
  cmsLayout,
  onHeaderPageOrderChanged,
  onFooterPageOrderChanged,
  createFile,
  deleteFile,
  triggerAutoSave,
}) => {
  const renderBranding = () => {
    return (
      <Branding
        cmsLayout={cmsLayout}
        createFile={createFile}
        deleteFile={deleteFile}
        formikProps={formikProps}
        triggerAutoSave={triggerAutoSave}
      />
    )
  }

  const renderHeader = () => {
    return (
      <Header
        cmsLayout={cmsLayout}
        formikProps={formikProps}
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
        onPageOrderUpdated={onFooterPageOrderChanged}
        triggerAutoSave={triggerAutoSave}
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
