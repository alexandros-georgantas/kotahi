/* eslint-disable react/no-array-index-key */
/* stylelint-disable selector-type-no-unknown */
/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { color } from '../../theme'
import { CloseButtonIcon } from '../wax-collab/src/CustomWaxToolGroups/CitationService/components/styles'
import { CssAssistantContext } from './hooks/CssAssistantContext'

const Wrapper = styled.span`
  display: flex;
  overflow: visible;
  position: relative;
`

export const chatFadeIn = keyframes`
   0% {
    opacity: 0;
    transform: translateX(-100%);
  }

   100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const MessageContent = styled.span`
  background-color: white;
  border-radius: 15px;
  box-shadow: ${p =>
    p.$pointerOnBottom
      ? 'inset -5px 8px 15px #0001'
      : 'inset 5px -8px 15px #0001'};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 18px;
  position: relative;
  width: 100%;
`

const MessageWrapper = styled.span`
  align-items: ${p => (p.$pointerOnRight ? 'flex-end' : 'flex-start')};
  display: flex;
  filter: drop-shadow(0 0 2px #0005);
  flex-direction: column;
  font-size: 14px;
  left: -10px;
  line-height: 1.1;
  min-width: 300px;
  position: ${p => p.position};
  top: 40px;
  transform: scale(${p => (p.$hide ? 0 : 1)});
  transform-origin: ${p => p.$transformOrigin};
  transition: transform 0.3s;
  /* white-space: nowrap; */
  z-index: 99999;

  > ${MessageContent} > * {
    opacity: ${p => (p.$hide ? 0 : 1)};
    transition: opacity 0.3s;
  }
`

const Triangle = styled.span`
  border-bottom: ${p => (!p.$pointerOnBottom ? '16px solid #fff' : '')};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: ${p => (p.$pointerOnBottom ? '16px solid #fff' : '')};
  height: 0;
  margin-bottom: ${p => (p.$pointerOnBottom ? '-1px' : '')};

  margin-left: ${p => (!p.$pointerOnRight ? '20px' : '')};
  margin-right: ${p => (p.$pointerOnRight ? '20px' : '')};
  margin-top: ${p => (!p.$pointerOnBottom ? '-1px' : '')};
  transform: skew(${p => p.skew});
  width: 0;
  z-index: 5;
`

const SmallText = styled.strong`
  color: ${color.brand1.shade25};
  text-decoration: underline;
`

const PaddedContent = styled.span`
  display: flex;
  flex-direction: column;
  padding: 8px;
`

const UnStyledButton = styled.button`
  background: none;
  border: none;
  color: ${color.brand1.shade50};
  cursor: pointer;
  font-size: 12px;
  outline: none;
  padding: 0;
  text-align: left;
  text-decoration: underline;

  &:hover {
    color: ${color.brand1.base};
  }
`

export const ChatBox = ({
  children,
  content,
  header,
  hide,
  $pointerOnBottom,
  $pointerOnRight,
  $transformOrigin = '30px 0',
  position = 'absolute',
  skew = '20deg',
  ...rest
}) => {
  return (
    <MessageWrapper
      $hide={hide}
      $pointerOnRight={$pointerOnRight}
      $transformOrigin={$transformOrigin}
      position={position}
      {...rest}
    >
      {!$pointerOnBottom && (
        <Triangle
          $pointerOnBottom={$pointerOnBottom}
          $pointerOnRight={$pointerOnRight}
          skew={skew}
        />
      )}
      <MessageContent $pointerOnBottom={$pointerOnBottom}>
        {children || (
          <>
            <span
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {header}
            </span>
            <PaddedContent>{content}</PaddedContent>
          </>
        )}
      </MessageContent>
      {$pointerOnBottom && (
        <Triangle
          $pointerOnBottom={$pointerOnBottom}
          $pointerOnRight={$pointerOnRight}
          skew={skew}
        />
      )}
    </MessageWrapper>
  )
}

const ResponsesUi = ({ forceHide }) => {
  const { feedback, setUserPrompt, promptRef } = useContext(CssAssistantContext)
  const [hideMessage, setHideMessage] = useState(false)

  useEffect(() => {
    setHideMessage(false)
  }, [feedback])

  const OptionsTemplate = ({ content }) => {
    return (
      <li>
        <UnStyledButton
          onClick={e => {
            setUserPrompt(e.target.textContent)
            promptRef.current.focus()
          }}
        >
          {String(content)}
        </UnStyledButton>
      </li>
    )
  }

  return (
    <Wrapper>
      <UnStyledButton
        onClick={() => setHideMessage(!hideMessage)}
        style={{
          fontSize: '18px',
          textDecoration: 'none',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          backgroundColor: color.brand1.base(),
          border: `2px solid ${color.brand1.tint50()}`,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        AI
      </UnStyledButton>
      <ChatBox
        hide={forceHide || (!forceHide && hideMessage)}
        style={{ whiteSpace: 'nowrap' }}
      >
        <span
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <SmallText>Kotahi AI PDF Designer:</SmallText>
          <UnStyledButton
            onClick={() => setHideMessage(!hideMessage)}
            style={{ objectFit: 'contain', width: '18px', height: '18px' }}
          >
            <CloseButtonIcon fill={color.brand1.base()} size="18" />
          </UnStyledButton>
        </span>
        <PaddedContent>
          {feedback ? (
            String(feedback)
              .split('\n')
              .map((line, i) =>
                /^[0-9.]|-/.test(line) ? (
                  <OptionsTemplate
                    content={line}
                    key={line + i}
                    onClick={e => {
                      setUserPrompt(e.target.textContent)
                      promptRef.current.focus()
                    }}
                  />
                ) : (
                  <span key={line + i}>{line}</span>
                ),
              )
          ) : (
            <>
              <span>Hello there!</span>
              <span>I'm here to help with your pdf design</span>
              <span>Also, you can ask for the current property values</span>
              <span>for example: Which is the title margin/color/size?</span>
              <span style={{ marginBottom: '8px' }}>
                Here you have some suggestions to get started:
              </span>
              <ul>
                <OptionsTemplate content="Make the Title blue, and add a underline" />
                <OptionsTemplate content="Wich is the size of the page?" />
                <OptionsTemplate content="The back should be Black and text white" />
                <OptionsTemplate content="Make the text sans serif" />
                <OptionsTemplate content="Paragraphs should be dark grey" />
              </ul>
            </>
          )}
        </PaddedContent>
      </ChatBox>
    </Wrapper>
  )
}

export default ResponsesUi
