/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'

const UserPromptInput = styled.textarea`
  background: none;
  border: none;
  caret-color: #056b05;
  font-size: inherit;
  height: 18px;
  outline: none;
  resize: none;
`

const StyledContainer = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 1rem 0.5rem;
`

const CssAssistant = ({ apiKey, enabled, parentCtx, ...rest }) => {
  const context = useRef([])

  const [selectedContexts, setSetselectedContexts] = useState([])
  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')

  const findCtxByNode = (node, ctx) => {
    return ctx.find(c => c.node === node)
  }

  const createCtx = (node, index, parentSelector) => {
    const selector = `${
      parentSelector ? `${parentSelector} > ${node.tagName}` : '#mainCtx'
    }`

    const childs = createChildsCtx(node, selector)
    return {
      index,
      node,
      tagname: node.tagName,
      childs: childs.map(ch => ch.node),
      rules: {},
      history: [],
      selector,
    }
  }

  const createChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children].map((node, index) =>
      createCtx(node, index, parentSelector),
    )

  useEffect(() => {
    // console.log(parentCtx())

    if (parentCtx()) {
      const mainCtx = createCtx(parentCtx(), 0, '')
      context.current = [mainCtx]

      const addListeners = ctx => {
        ctx.node.addEventListener('click', selectNode)
        ctx?.childs &&
          ctx?.childs?.length > 0 &&
          ctx.childs.forEach(child => addListeners(child))
      }

      addListeners(context.current[0])

      // console.log(context.current)
    }

    return () => {
      ;[...parentCtx().querySelectorAll('*')].forEach(node =>
        node.removeEventListener('click', selectNode),
      )
      parentCtx().removeEventListener('click', selectNode)
    }
  }, [parentCtx])

  const handleChange = ({ target }) => setUserPrompt(target.value)

  const selectNode = e => {
    e.stopPropagation()
    setSetselectedContexts(findCtxByNode(e.target))
  }

  const autoResize = () => {
    if (promptRef.current) {
      promptRef.current.style.height = 'auto'
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`
    }
  }

  return (
    <StyledContainer>
      <UserPromptInput
        disabled={!enabled}
        onChange={handleChange}
        onInput={autoResize}
        ref={promptRef}
        resize="none"
        value={userPrompt}
        {...rest}
      />
    </StyledContainer>
  )
}

export default CssAssistant
