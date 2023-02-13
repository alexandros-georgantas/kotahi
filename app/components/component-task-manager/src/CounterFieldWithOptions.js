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

const CounterFieldWithOptions = ({
  value,
  options,
  onChange = () => {},
}) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(options.findIndex(opt => opt.value === value))

  useEffect(() => {
    onChange(selectedOption)
  }, [selectedOption])

  useEffect(() => {
    setSelectedOption(options[selectedIndex])
  }, [selectedIndex])

  const increaseCounter = () => {
    let index = selectedIndex || 0
    index = index + 1
    if (index >= options.length) {
      index = 0
    }
    setSelectedIndex(index)
  }

  const decreaseCounter = () => {
    let index = selectedIndex || 0
    index = index - 1
    if (index < 0) {
      index = options.length - 1
    }
    setSelectedIndex(index)
  }

  return (
    <Container>
      <LabelContainer>
        {selectedOption?.label}
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

export default CounterFieldWithOptions
