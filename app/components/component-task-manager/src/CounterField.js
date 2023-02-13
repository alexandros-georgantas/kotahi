import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown } from 'react-feather'
import { TextField } from '@pubsweet/ui/dist/atoms'
import { GroupedOptionsSelect } from '../../shared'
import TextInput from './TextInput'

const Container = styled.div`
  display: flex;
  height: 26px;
`

const LabelContainer = styled.div`
  background: #FFFFFF;
  border: 1.5px solid #BFBFBF;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
`

const ControlsContainer = styled.div`
  margin-left: 4px;
  display: flex;
  flex-direction: column;
`

const CounterActionContainer = styled.div`
  button {
    cursor: pointer;
    background: transparent;
    border: none;

    svg {
      color: #6C6C6C;
    }

    &:hover {
      svg {
        stroke: #3AAE2A;
      }
    }
  }
`

const CounterValueUp = styled(CounterActionContainer)`
  margin-top: -3px;
`
const CounterValueDown = styled(CounterActionContainer)`
  margin-top: -10px;
`

const CounterField = ({value: defaultValue, minValue, maxValue}) => {
  const [value, setValue] = useState(defaultValue)

  const increaseCounter = () => {
    let updatedValue = value || 0
    updatedValue = updatedValue + 1
    if (maxValue !== null && updatedValue > maxValue) {
      updatedValue = maxValue
    }
    setValue(updatedValue)
  }

  const decreaseCounter = () => {
    let updatedValue = value || 0
    updatedValue = updatedValue - 1
    if (minValue !== null && updatedValue < minValue) {
      updatedValue = minValue
    }
    setValue(updatedValue)
  }

  return (
    <Container>
      <LabelContainer>
        {value}
      </LabelContainer>
      <ControlsContainer>
        <CounterValueUp>
          <button type="button" onClick={() => increaseCounter()}>
            <ChevronUp size={16} />
          </button>
        </CounterValueUp>
        <CounterValueDown>
          <button type="button" onClick={() => decreaseCounter()}>
            <ChevronDown size={16} />
          </button>
        </CounterValueDown>
      </ControlsContainer>
    </Container>
  )
}

export default CounterField
