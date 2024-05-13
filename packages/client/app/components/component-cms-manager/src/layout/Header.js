import React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutMainHeading, LayoutSecondaryHeading } from '../style'
import PageOrder from './PageOrder'

const Header = ({ cmsLayout, updateCmsLayout }) => {
  const { t } = useTranslation()
  return (
    <div>
      <LayoutMainHeading>
        {t('cmsPage.layout.Header')}
        <LayoutSecondaryHeading>
          {t('cmsPage.layout.useCheckbox')}
        </LayoutSecondaryHeading>
      </LayoutMainHeading>
      <PageOrder
        initialItems={cmsLayout.flaxHeaderConfig}
        onPageOrderUpdated={newOrder =>
          updateCmsLayout({
            flaxHeaderConfig: newOrder.map(x => ({
              sequenceIndex: x.sequenceIndex,
              shownInMenu: x.shownInMenu,
            })),
          })
        }
      />
    </div>
  )
}

export default Header
