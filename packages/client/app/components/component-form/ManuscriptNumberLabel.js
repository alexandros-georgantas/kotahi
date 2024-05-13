import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import theme from '../../theme'

const NoteRight = styled.div`
  float: right;
  font-size: ${theme.fontSizeBaseSmall};
  line-height: ${theme.lineHeightBaseSmall};
`

const ManuscriptNumberLabel = ({ manuscriptShortId }) => {
  const { t } = useTranslation()

  return (
    <NoteRight>
      {t('decisionPage.metadataTab.Manuscript Number')} {manuscriptShortId}
    </NoteRight>
  )
}

export default ManuscriptNumberLabel
