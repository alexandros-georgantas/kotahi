/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'
import { color } from '../../theme'

const StyledContainer = styled.div`
  --color: #2fac66;
  --font-size: 16px;
  align-items: center;
  background-color: #fffe;
  border: 4px solid var(--color);
  border-radius: 30px;
  box-shadow: 0 0 5px #0004, inset 0 0 5px #0004;
  display: flex;
  font-size: var(--font-size);
  height: fit-content;
  justify-content: center;
  overflow: visible;
  padding: 0.4rem 0.8rem;
  position: relative;
  scroll-behavior: smooth;
  transition: all 0.5s;
  width: fit-content;

  textarea {
    --height: ${p =>
      p.height || `calc(var(--font-size) + (var(--font-size) / 2));`};
    background: none;
    border: none;
    caret-color: var(--color);
    font-size: inherit;
    height: var(--height);
    max-height: 100px;
    outline: none;
    overflow: auto;
    resize: none;
    width: 70%;
  }
`

const CssAssistant = ({ apiKey, enabled, parentCtx, baseId, ...rest }) => {
  const context = useRef([])

  const [selectedCtx, setSelectedCtx] = useState([])
  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')

  const getCtxByNode = node => {
    return context.current.find(c => c.node === node)
  }

  const createCtx = (node, index, parentSelector) => {
    const tagName = node.tagName.toLowerCase()

    const selector = `${
      parentSelector ? `${parentSelector} > ${tagName}` : node.id || baseId
    }`.trim()

    const childs = createChildsCtx(node, selector)
    return {
      selector,
      index,
      node,
      tagName,
      childs,
    }
  }

  const addToCtx = ctx => {
    context.current = [...context.current, ctx]
    return ctx
  }

  const createChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children].map((node, index) =>
      addToCtx(createCtx(node, index, parentSelector)),
    )

  useEffect(() => {
    // console.log(parentCtx)

    if (parentCtx) {
      addToCtx(createCtx(parentCtx, 0, ''))
      context.current = context.current.map((ctx, i) => ({
        ...ctx,
        index: i + 1,
        history: [],
        rules: {},
      }))
      // console.log(context.current)

      context.current.forEach(
        ctx => ctx.node && ctx.node.addEventListener('click', selectNode),
      )
    }
  }, [parentCtx])

  useEffect(() => {
    return () => {
      if (parentCtx) {
        context.current.forEach(
          ctx => ctx.node && ctx.node.removeEventListener('click', selectNode),
        )
      }
    }
  }, [])
  const handleChange = ({ target }) => setUserPrompt(target.value)

  const selectNode = e => {
    e.stopPropagation()
    setSelectedCtx(prev => {
      const temp = prev
      prev.node && (temp.node.style.outline = 'none')
      return getCtxByNode(e.target)
    })
  }

  useEffect(() => {
    selectedCtx.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
  }, [selectedCtx])

  const autoResize = () => {
    if (promptRef.current) {
      const lines = promptRef.current.value.split('\n').length
      promptRef.current.style.height = 'auto'
      lines === 1
        ? (promptRef.current.style.height = '24px')
        : (promptRef.current.style.height = `${promptRef.current.scrollHeight}px`)
    }
  }

  return (
    <StyledContainer>
      <textarea
        disabled={!enabled}
        onChange={handleChange}
        onInput={autoResize}
        ref={promptRef}
        value={userPrompt}
        {...rest}
      />
    </StyledContainer>
  )
}

export default CssAssistant
