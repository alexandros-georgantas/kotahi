import React from 'react'
import {
  Cell,
  CellPageTitle,
  CMSPageListRow,
  CMSPagesLeftPane,
  CMSPagesRightPane,
  Status,
  Hrstyle,
} from '../style'
import { convertTimestampToDateWithoutTimeString } from '../../../../shared/dateUtils'

const CMSPageRow = ({ cmsPage, onManageClick }) => {
  return (
    <CMSPageListRow key={cmsPage.id}>
      <CMSPagesLeftPane>
        {/* <CheckboxInput type="checkbox" /> */}
        <CellPageTitle onClick={() => onManageClick(cmsPage)}>
          {cmsPage.title}
        </CellPageTitle>
        <Hrstyle />
        <Status> Published</Status>
      </CMSPagesLeftPane>
      <CMSPagesRightPane>
        <Cell>Admin</Cell>
        <Cell>{convertTimestampToDateWithoutTimeString(cmsPage.updated)}</Cell>
        <Cell>{convertTimestampToDateWithoutTimeString(cmsPage.created)}</Cell>
      </CMSPagesRightPane>
    </CMSPageListRow>
  )
}

export default CMSPageRow
