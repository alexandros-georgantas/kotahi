import React from 'react'
import styled from 'styled-components'
import { rotate360, th } from '@pubsweet/ui-toolkit'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
const SpinnerAnimation = styled.div`
  display: inline-block;
  height: 64px;
  width: 64px;

  &:after {
    animation: ${rotate360} 1s linear infinite;
    border: 5px solid ${th('colorPrimary')};
    border-color: ${th('colorPrimary')} transparent ${th('colorPrimary')}
      transparent;
    border-radius: 50%;
    content: ' ';
    display: block;
    height: 46px;
    margin: 1px;
    width: 46px;
  }
`

const Loading = () => (
  <Wrapper>
    <SpinnerAnimation />
  </Wrapper>
)

export default Loading