import React from 'react'
import { SectionContent, PaddedContent } from '../../../shared'
import Header from './Header'
import Branding from './Branding'
import Footer from './Footer'

const LayoutForm = ({
  formikProps,
  cmsLayout,
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
        updateCmsLayout={delta =>
          updateCmsLayout({ languageLayouts: [{ ...delta, id: cmsLayout.id }] })
        }
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
        updateCmsLayout={delta =>
          updateCmsLayout({ languageLayouts: [{ ...delta, id: cmsLayout.id }] })
        }
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
