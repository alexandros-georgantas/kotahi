import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import SimpleWaxEditor from '../../../wax-collab/src/SimpleWaxEditor'
import { Icon, Action, LooseRow, LabelBadge } from '../../../shared'

const DetailPane = styled.div`
  background: ${th('colorSecondaryBackground')};
  border: 1px solid ${th('colorFurniture')};
  border-radius: ${th('borderRadius')};
  margin-bottom: 8px;
  padding: 8px;

  & > h2 {
    font-size: ${th('fontSizeHeading5')};
    font-weight: bold;
    margin-right: 1em;
  }
`

const RightLooseRow = styled(LooseRow)`
  float: right;
  width: unset;
`

const FormSummary = ({ form, openFormSettingsDialog }) => {
  return (
    <DetailPane>
      <RightLooseRow>
        {form.isDefault && form.category === 'submission' && (
          <LabelBadge color={th('colorSecondary')}>Default</LabelBadge>
        )}
        {form.isActive && (
          <LabelBadge color={th('colorPrimary')}>Active</LabelBadge>
        )}
        <Action onClick={openFormSettingsDialog} title="Edit form settings">
          <Icon noPadding>edit</Icon>
        </Action>
      </RightLooseRow>
      <h2>{form.structure.name}</h2>
      <SimpleWaxEditor
        key={form.structure.description}
        readonly
        value={form.structure.description}
      />
    </DetailPane>
  )
}

export default FormSummary
