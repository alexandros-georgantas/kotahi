import React from 'react'
import styled from 'styled-components'
import { color, space } from '../../theme'

const CheckboxContainer = styled.div`
  align-content: center;
  display: flex;
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

const Label = styled.label`
  color: ${({ disabled }) => (disabled ? color.gray50 : color.text)};
  padding-left: ${space.e};
`

// eslint-disable-next-line import/prefer-default-export
export const Checkbox = props => {
  const { checked, className, disabled, id, label, value, handleChange } = props

  return (
    <CheckboxContainer className={className}>
      <input
        checked={checked}
        disabled={disabled}
        id={id}
        name={value}
        onChange={handleChange}
        type="checkbox"
      />
      <Label disabled={disabled} htmlFor={id}>
        {label}
      </Label>
    </CheckboxContainer>
  )
}
