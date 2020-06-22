import styled, { css } from 'styled-components'
import { Action } from '@pubsweet/ui'
import { th, grid } from '@pubsweet/ui-toolkit'

export const Table = styled.table`
  width: 100%;
  border-radius: ${th('borderRadius')};
  border-collapse: collapse;
  font-size: ${th('fontSizeBaseSmall')};

  td {
    width: 33%;
  }
`
export const Header = styled.thead`
  text-align: left;
  font-variant: all-small-caps;
  border-bottom: 1px solid ${th('colorFurniture')};

  background-color: ${th('colorBackgroundHue')};

  th {
    padding: ${grid(1)} ${grid(3)};
  }
`

export const Container = styled.div`
  padding: ${grid(2)};
`

export const Row = styled.tr`
  max-height: ${grid(8)};
  border-bottom: 1px solid ${th('colorFurniture')};

  &:hover {
    background-color: ${th('colorBackgroundHue')};
  }
`

export const Cell = styled.td`
  padding-bottom: ${grid(2)};
  padding-top: calc(${grid(2)} - 1px);
  padding-left: ${grid(3)};
  padding-right: ${grid(3)};
  button {
    font-size: ${th('fontSizeBaseSmall')};
  }
`

export const UserCombo = styled.div`
  display: flex;
  line-height: ${grid(2.5)};
  align-items: center;
`

export const LastCell = styled(Cell)`
  text-align: right;
`

export const Primary = styled.div`
  font-weight: 500;
`

export const Secondary = styled.div`
  color: ${th('colorTextPlaceholder')};
`

export const UserInfo = styled.div`
  margin-left: ${grid(1)};
`

export const Caret = styled.svg`
  ${props =>
    props.active
      ? css`
          color: ${th('colorPrimary')};
        `
      : css`
          color: ${th('colorSecondary')};
        `}
`

export const Carets = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin-left: ${grid(0.5)};
  svg {
    height: ${grid(1.5)};
  }
  svg:nth-of-type(2) {
    margin-top: ${grid(-0.5)};
  }
`

// TODO: Extract common above
// Specific

const Status = styled.span`
  border-radius: 8px;
  font-variant: all-small-caps;
  padding: ${grid(0.5)} ${grid(1)};
`
export const SuccessStatus = styled(Status)`
  background-color: ${th('colorSuccess')};
`

export const ErrorStatus = styled(Status)`
  background-color: ${th('colorError')};
`

export const NormalStatus = styled(Status)`
  background-color: ${th('colorWarning')};
  // color: ${th('colorTextReverse')};
`
