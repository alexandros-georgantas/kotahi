import React from 'react'
import { useTranslation } from 'react-i18next'

import { LayoutSecondaryHeading, LayoutMainHeading } from '../style'

const SiteStatus = ({
  flaxSiteUrlForGroup,
  isPrivate,
  privatePublishingHash,
  triggerAutoSave,
}) => {
  const { t } = useTranslation()

  const url = `${flaxSiteUrlForGroup}${
    isPrivate ? `${privatePublishingHash}/` : ''
  }`

  const toggleChange = isChecked => {
    const data = {}
    data.isPrivate = isChecked
    data.hexCode = privatePublishingHash

    if (!isChecked) {
      data.hexCode = null
    }

    triggerAutoSave(data)
  }

  return (
    <>
      <LayoutMainHeading>{t('cmsPage.layout.Status')}</LayoutMainHeading>
      <div>
        <input
          checked={isPrivate}
          name="isPrivate"
          onChange={e => toggleChange(e.target.checked)}
          style={{ margin: '10px 10px 10px 0' }}
          type="checkbox"
          value={false}
        />
        {t('cmsPage.layout.DraftCheckbox')}
      </div>
      <LayoutSecondaryHeading>
        {t('cmsPage.layout.MakeFlaxSitePrivate')}
      </LayoutSecondaryHeading>
      <div>
        <a href={`${url}`} target="blank">{`${url}`}</a>
      </div>
    </>
  )
}

export default SiteStatus
