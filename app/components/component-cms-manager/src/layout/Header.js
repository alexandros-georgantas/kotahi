import React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutMainHeading, LayoutSecondaryHeading } from '../style'
import PageOrder from './PageOrder'

const Header = ({ cmsLayout, onPageOrderUpdated, curLang }) => {
  const { t } = useTranslation()
  return (
    <div key={curLang}>
      <LayoutMainHeading>
        {t('cmsPage.layout.Header')}
        <LayoutSecondaryHeading>
          {t('cmsPage.layout.useCheckbox')}
        </LayoutSecondaryHeading>
      </LayoutMainHeading>
      <PageOrder
        curLang={curLang}
        initialItems={cmsLayout.flaxHeaderConfig}
        onPageOrderUpdated={onPageOrderUpdated}
      />
    </div>
  )
}

export default Header
