import styled, { css } from 'styled-components'
import { grid } from '@pubsweet/ui-toolkit'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import Color from 'color'

export const SelectAllField = styled.div`
  align-items: center;
  display: flex;
`
export const SelectedManuscriptsNumber = styled.p`
  font-weight: bold;
  margin-left: 10px;
  margin-right: 15px;
`
export const ControlsContainer = styled.div`
  display: flex;
  flex: 1 1;
  gap: ${grid(2)};
  justify-content: flex-end;
`

export const BulkActionModalContainer = styled.div`
  background-color: white;
  padding: 10px;
`

export const BulkActionModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
`

export const BulkActionModalButton = styled(Button)`
  cursor: pointer;
`
export const BulkArchiveModalContainer = styled.div`
  background-color: white;
  padding: 10px;
`

export const BulkArchiveModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
`

export const BulkArchiveModalButton = styled(Button)`
  cursor: pointer;
`

export const ManuscriptsTable = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  margin-top: ${grid(1)};
  width: 100%;
`

export const ManuscriptsRow = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-top: 1px solid ${th('colorFurniture')};
  column-gap: ${grid(2)};
  display: flex;
  flex-direction: row;
  line-height: 1.4em;
  padding: ${grid(0.5)} ${grid(2)};
  text-align: left;
  width: 100%;

  &:first-child {
    border-top: none;
  }
`

export const SnippetRow = styled.div`
  background-color: ${th('colorSecondaryBackground')};
  color: ${th('colorIconPrimary')};
  padding: ${grid(0.5)} ${grid(4)};
  text-align: left;
  width: 100%;
`

export const ManuscriptsHeaderRow = styled(ManuscriptsRow)`
  align-items: baseline;
  background-color: ${th('colorSecondaryBackground')};
  font-variant: all-small-caps;
  line-height: 1.25em;
`

export const Cell = styled.div`
  flex: ${({ flex }) => flex ?? '0 1 12em'};

  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
    `}

  overflow: hidden;
  overflow-wrap: anywhere;
`

export const HeadingCell = styled(Cell)`
  align-items: center;
  display: flex;
`

/** Displays the label as a badge colored according to props.color */
export const LabelBadge = styled.div`
  border-radius: 8px;
  display: inline-block;
  font-size: ${th('fontSizeBaseSmall')};
  font-variant: all-small-caps;
  line-height: 1.1em;
  max-width: 100%;
  ${props =>
    props.color &&
    css`
      background-color: ${props.color};
      ${Color(props.color).isDark()
        ? css`
            color: ${th('colorTextReverse')};
          `
        : ''};
    `}
  overflow-wrap: normal;
  padding: ${grid(0.5)} ${grid(1)};
  text-overflow: clip;
`

export const SortArrow = styled.span`
  color: ${th('colorPrimary')};
  font-size: 70%;
  margin-left: 0.5em;

  &::before {
    content: '${({ direction }) => (direction === 'ASC' ? '▼' : '▲')}';
  }
`