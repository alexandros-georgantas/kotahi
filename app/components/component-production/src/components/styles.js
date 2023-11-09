import styled, { css } from 'styled-components'
import { grid } from '@pubsweet/ui-toolkit'
import { color } from '../../../../theme'

export const Info = styled.span`
  align-items: center;
  display: flex;
  height: 500px;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
`

export const Cell = styled.div`
  display: flex;
  flex: ${({ flex }) => flex ?? '0 1 12em'};
  flex-direction: row;
  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
  ${props =>
    props.centered &&
    css`
      justify-content: center;
    `}
  overflow-wrap: anywhere;
`

export const HeadingCell = styled(Cell)`
  align-items: center;
  display: flex;
`

export const StyledFileRow = styled.div`
  align-items: center;
  background-color: ${color.backgroundA};
  border-top: 1px solid ${color.gray90};
  column-gap: ${grid(2)};
  display: flex;
  flex-direction: row;
  line-height: 1.4em;
  text-align: left;
  width: 100%;

  &:first-child {
    border-top: none;
    padding: ${grid(0.5)} ${grid(2)};
  }

  &:not(:first-child) {
    padding: ${grid(1.5)} ${grid(2)};
  }
`
