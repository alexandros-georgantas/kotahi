import React from 'react'
import styled from 'styled-components'
import { color, space } from '../../theme'

const CheckboxContainer = styled.div`
  align-content: center;
  display: flex;
  gap: ${space.e};
  margin-bottom: 4px;

  input[type='checkbox'] {
    accent-color: ${color.brand1.shade25};
    background: ${color.gray97};
    border: 1px solid ${color.gray80};
    border-radius: 5px;
    color: white;
    padding: 14px 9px;

    &:active,
    &:focus-visible {
      /* border: 1px solid ${color.gray70}; */
      outline: none;
    }

    &:hover {
      accent-color: ${color.brand1.shade25};
      border: none;
    }
  }
`

// eslint-disable-next-line import/prefer-default-export
export const Checkbox = props => {
  const {
    checked,
    id,
    label,
    value,
    style = {},
    handleChange,
    labelBefore,
  } = props

  return (
    <CheckboxContainer style={style}>
      {labelBefore && <label htmlFor={id}>{label}</label>}
      <input
        checked={checked}
        id={id}
        name={value}
        onChange={handleChange}
        type="checkbox"
      />
      {!labelBefore && <label htmlFor={id}>{label}</label>}
    </CheckboxContainer>
  )
}
