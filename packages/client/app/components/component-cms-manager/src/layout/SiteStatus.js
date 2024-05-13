import React from 'react'
import { useTranslation } from 'react-i18next'

import { LayoutSecondaryHeading, LayoutMainHeading } from '../style'

const SiteStatus = ({
  flaxSiteUrlForGroup,
  isPrivate,
  privatePublishingHash,
  updateCmsLayout,
}) => {
  const { t } = useTranslation()

  const url = `${flaxSiteUrlForGroup}${
    isPrivate ? `${privatePublishingHash}/` : ''
  }`

  const toggleChange = isChecked => {
    updateCmsLayout({ isPrivate: isChecked })
  }

  return (
    <>
      <LayoutMainHeading>{t('cmsPage.layout.Status')}</LayoutMainHeading>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <input
          checked={isPrivate}
          name="isPrivate"
          onChange={e => toggleChange(e.target.checked)}
          style={{ margin: '10px 10px 10px 0' }}
          type="checkbox"
          value={false}
        />
        {t('cmsPage.layout.DraftCheckbox')}
      </label>
      <LayoutSecondaryHeading>
        {t(
          isPrivate
            ? 'cmsPage.layout.MakeFlaxSitePrivate'
            : 'cmsPage.layout.publishingTo',
        )}
      </LayoutSecondaryHeading>
      <div>
        <a href={`${url}`} target="blank">{`${url}`}</a>
      </div>
    </>
  )
}

export default SiteStatus
