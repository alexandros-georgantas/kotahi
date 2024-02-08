/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'
import useStylesheets from './hooks/useStyleSheet'
import { safeCall } from './utils/helpers'

const StyledForm = styled.form`
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
    if (parentCtx) {
      addToCtx(createCtx(parentCtx, 0, '')) // creates the whole context starting from the parentCtx
      context.current = context.current.map((ctx, i) => ({
        ...ctx,
        history: [],
        rules:
          ctx.node === parentCtx
            ? [
                { rule: 'background', value: '#5a8' },
                { rule: 'color', value: '#eee' },
              ]
            : [{}], // this should be the actual computedStyles from ctx.node
      }))

      createStyleSheet()

      context.current.forEach(ctx => insertRule(styleSheetRef.current, ctx))

      const randomCtx = context.current[3]

      const randomRules = [
        { rule: 'border-radius', value: '5px' },
        { rule: 'color', value: '#1f1f1f' },
        { rule: 'padding', value: '8px 15px' },
        { rule: 'background', value: '#eef6ff' },
      ]

      // -- addRules() usage --
      addRules(randomCtx, randomRules)

      context.current.forEach(ctx => {
        ctx.node && ctx.node.classList.add(ctx.className)
        ctx.node && ctx.node.addEventListener('click', selectCtx)
      })
    }
  }, [parentCtx])

  useEffect(() => {
    return () => {
      if (parentCtx) {
        context.current.forEach(
          ctx => ctx.node && ctx.node.removeEventListener('click', selectCtx),
        )
      }
    }
  }, [])

  useEffect(() => {
    selectedCtx.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
  }, [selectedCtx])

  // #endregion HOOKS

  // #region CONTEXT

  const createCtx = (node, parentSelector) => {
    const index = [...node.parentNode.children].indexOf(node)
    const tagName = node.tagName.toLowerCase()
    const className = `index_${index}`

    const selector = `${
      parentSelector
        ? `${parentSelector} > ${tagName}.${
            className || '' /* this will be used when element is selected */
          }`
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
    [...ctxNode.children].map(node => addToCtx(createCtx(node, parentSelector)))

  const getCtxBy = (by, prop) => {
    const ctxProps = {
      node: node => context.current.find(ctx => ctx.node === node),
      selector: selector =>
        context.current.find(ctx => ctx.selector === selector),
    }

    return ctxProps[by](prop)
  }

  const addToCtx = ctx => {
    context.current = [...context.current, ctx]
    return ctx
  }

  const updateCtx = ({ ctx, prop, propValue, onUpdate }) => {
    const scopedCtx = getCtxBy('node', ctx.node)
    if (!scopedCtx) return
    scopedCtx[prop] = propValue
    safeCall(onUpdate)()
  }

  const createRules = (ctx, inputRules = []) => {
    if (!ctx) return null
    const prev = ctx.rules

    const existingRule = rule => prev.find(rules => rules.rule === rule)

    inputRules.forEach(({ rule, value }, i) =>
      existingRule(rule)
        ? (prev[i] = { rule, value })
        : prev.push({ rule, value }),
    )
    ctx.rules = prev
    return prev
  }

  const addRules = (ctx, inputRules) => {
    updateCtx({
      ctx,
      prop: 'rules',
      propValue: createRules(ctx, inputRules),
      onUpdate: () => updateRule(styleSheetRef.current, ctx),
    })
  }

  // #endregion CONTEXT
  const createStyleSheet = () => {
    if (!document.getElementById('css-assistant-scoped-styles')) {
      const styleTag = document.createElement('style')
      styleTag.id = 'css-assistant-scoped-styles'
      parentCtx.parentNode.insertBefore(styleTag, parentCtx)
      styleSheetRef.current = styleTag
    } else {
      styleSheetRef.current = document.getElementById(
        'css-assistant-scoped-styles',
      )
    }
  }

  const handleChange = ({ target }) => setUserPrompt(target.value)

  const selectCtx = e => {
    e.stopPropagation()
    setSelectedCtx(prev => {
      const temp = prev
      prev.node && (temp.node.style.outline = 'none')
      return getCtxBy('node', e.target)
    })
  }

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
    <StyledForm $enabled={enabled}>
      <textarea
        disabled={!enabled}
        onChange={handleChange}
        onInput={autoResize}
        ref={promptRef}
        value={userPrompt}
        {...rest}
      />
    </StyledForm>
  )
}

export default CssAssistant
