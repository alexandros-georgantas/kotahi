/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { fadeIn } from '@pubsweet/ui-toolkit'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import { color } from '../../theme'
import { chatFadeIn } from './ResponsesUi'

const ChatHistoryContainer = styled.div`
  --profile-picture-size: 25px;
  --message-header-gap: 8px;

  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 89%;
  overflow: auto;
  padding: 25px;
  position: relative;
  scroll-behavior: smooth;
  transition: width 0.5s;
  user-select: none;
  width: 100%;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #777;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }

  > hr {
    animation: ${fadeIn} 1s;
    margin: 0 0 1em;
    padding: 2px 0;
  }
`

const MessageContainer = styled.div`
  animation: ${chatFadeIn} 0.5s;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 0 10px;
`

const MessageHeader = styled.div`
  align-items: center;
  display: flex;
  gap: var(--message-header-gap);

  > img,
  span {
    border-radius: 50%;
    height: var(--profile-picture-size);
    object-fit: contain;
    width: var(--profile-picture-size);
  }

  > strong {
    line-height: 1;
  }

  > span {
    font-size: 12px;
  }
`

const MessageContent = styled.div`
  border-left: 1px solid #0002;
  margin: 4px calc(var(--message-header-gap) + var(--profile-picture-size));
  padding: 0 8px;
`

const ChatHistory = ({ user }) => {
  const { selectedCtx, htmlSrc } = useContext(CssAssistantContext)
  const threadRef = useRef(null)
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const container = threadRef.current

          if (container) {
            container.scrollTop = container.scrollHeight
          }
        }
      })
    })

    const chatContainer = threadRef.current

    if (chatContainer) {
      observer.observe(chatContainer, { childList: true })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <ChatHistoryContainer ref={threadRef}>
      {selectedCtx?.history?.length > 0 ? (
        selectedCtx.history.map(({ role, content }, i) => (
          <span key={role + content + i}>
            {i !== 0 && <hr />}
            <MessageContainer
              onLoad={e =>
                e.target.scrollIntoView({ behavior: 'smooth', block: 'end' })
              }
            >
              <MessageHeader>
                {role === 'user' ? (
                  <>
                    <img
                      alt={`${user.username} profile`}
                      src={user.profilePicture}
                    />
                    <strong>{user?.username}:</strong>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        color: '#fff',
                        background: color.brand1.base(),
                        textAlign: 'center',
                      }}
                    >
                      AI
                    </span>
                    <strong>Kotahi AI PDF designer:</strong>
                  </>
                )}
              </MessageHeader>
              <MessageContent>{content}</MessageContent>
            </MessageContainer>
          </span>
        ))
      ) : (
        <>
          <span
            style={{
              color: '#777',
              background: '#fff',
              padding: '10px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            {`Make your first prompt related to ${
              selectedCtx?.node === htmlSrc
                ? 'the article'
                : `this <${selectedCtx?.tagName || 'selected'}> element`
            }`}
          </span>
          {/* {selectedCtx.node === htmlSrc && <span>Main</span>} */}
        </>
      )}
    </ChatHistoryContainer>
  )
}

export default ChatHistory
