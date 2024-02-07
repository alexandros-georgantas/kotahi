/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'
import useStylesheets from './hooks/useStyleSheet'
import { getComputed } from './utils/helpers'

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
    width: 100%;
  }
`

const CssAssistant = ({ apiKey, enabled, parentCtx, baseId, ...rest }) => {
  // #region HOOKS
  const context = useRef([])
  const styleSheetRef = useRef(null)
  const [selectedCtx, setSelectedCtx] = useState([])
  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')

  const { insertRule, deleteRule, updateRule } = useStylesheets()

  useEffect(() => {
    // console.log(parentCtx)

    if (parentCtx) {
      addToCtx(createCtx(parentCtx, 0, '')) // creates the whole context tarting from the parentCtx
      context.current = context.current.map((ctx, i) => ({
        ...ctx,
        history: [],
        rules: [{ rule: 'color', value: 'green' }], // this should be the actual computedStyles from ctx.node
      }))
      // console.log(context.current)

      if (!document.getElementById('css-assistant-scoped-styles')) {
        const styleTag = document.createElement('style')
        styleTag.id = 'css-assistant-scoped-styles'
        parentCtx.parentNode.insertBefore(styleTag, parentCtx)
        styleSheetRef.current = styleTag
        // console.log(styleSheetRef.current)
      } else {
        styleSheetRef.current = document.getElementById(
          'css-assistant-scoped-styles',
        )
      }

      context.current.forEach(ctx => insertRule(styleSheetRef.current, ctx))
      //       const recursiveInsert = cntxt =>
      //   cntxt.forEach(ctx => {
      //     insertRule(styleSheetRef.current, ctx)
      //     ctx.childs.length > 0 && recursiveInsert(ctx.childs)
      //   })

      // recursiveInsert(context.current)
      // updateRule(styleSheetRef.current, {
      //   ...getCtxBy('node', parentCtx),
      //   rules: [
      //     ...getCtxBy('node', parentCtx).rules,
      //     { rule: 'color', value: 'blue' },
      //   ],
      // })
      // console.log(styleSheetRef.current)

      context.current.forEach(ctx => {
        ctx.node && ctx.node.classList.add(ctx.className)
        ctx.node && ctx.node.addEventListener('click', selectNode)
      })
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
  // #endregion HOOKS

  // #region CONTEXT
  // -- create --
  const createCtx = (node, parentSelector) => {
    const index = [...node.parentNode.children].indexOf(node)
    const tagName = node.tagName.toLowerCase()
    const className = `index_${index}`

    const selector = `${
      parentSelector
        ? `${parentSelector} > ${tagName}.${className}`
        : `#${node.id || baseId}`
    }`.trim()

    const childs = createChildsCtx(node, selector)
    return {
      selector,
      className,
      index,
      node,
      tagName,
      childs,
    }
  }

  const createChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children].map((node, index) =>
      addToCtx(createCtx(node, parentSelector)),
    )

  // -- handle
  const getCtxBy = (by, prop) => {
    const ctxProps = {
      node: node => context.current.find(c => c.node === node),
      selector: selector => context.current.find(c => c.selector === selector),
    }

    return ctxProps[by](prop)
  }

  const addToCtx = ctx => {
    context.current = [...context.current, ctx]
    return ctx
  }

  const updateCtx = (ctx, newRules) => {
    const scopedCtx = getCtxBy('node', ctx.node)
    if (!scopedCtx) return
    scopedCtx.rules = { ...scopedCtx.rules, newRules }
  }
  // #endregion CONTEXT

  const handleChange = ({ target }) => setUserPrompt(target.value)

  const selectNode = e => {
    e.stopPropagation()
    setSelectedCtx(prev => {
      const temp = prev
      prev.node && (temp.node.style.outline = 'none')
      return getCtxBy('node', e.target)
    })
  }

  useEffect(() => {
    selectedCtx.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
  }, [selectedCtx])

  const autoResize = () => {
    if (promptRef.current) {
      const lines = promptRef.current.value.split('\n').length
      promptRef.current.style.height = 'auto'
      promptRef.current.scrollHeight === 42
        ? (promptRef.current.style.height = `${24 * lines}px`)
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
