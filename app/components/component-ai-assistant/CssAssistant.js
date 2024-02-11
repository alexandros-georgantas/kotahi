/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import useStylesheet from './hooks/useStyleSheet'
import { onEntries, safeCall } from './utils/helpers'
import SendButton from './SendButton'

const CHAT_GPT_QUERY = gql`
  query ChatGpt($input: String!, $history: [ChatGptMessage!]) {
    chatGPT(input: $input, history: $history)
  }
`

const getSelectorsRecursively = ctx => [
  ctx.selector,
  ...ctx.childs.map(child => child.selector),
]

const systemGuidelines = ctx => `

You are a CSS, JS and HTML expert, your task is to interpret which changes the 'user' wants to do on a css property from an html tag.

You must retain the contex of the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.

Keep in mind that 'user' might not know css, so the prompt must be analysed carefully in order to complete the task.

[validSelector] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${getSelectorsRecursively(
  ctx,
).join(
  ', ',
)}], If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "${
  ctx.selector
}" as default value. This variable represents the HTML element whose CSS properties need to be changed.

["validSelector"] also can be followed by ::nth-of-type(n) or nth-child(n) pseudoselectors, but ONLY if user specifies a number for the element,

Provide a CSS rule and its value in the following JSON format: {"[validSelector]": {"cssRule": "validCSSValue"}, ...moreRulesIfMoreHtmlElementsAreInvolved}.

Use hex for colors and px units for sizes.

You cannot use individual properties, like ('background-image', 'background-color', 'border-color', ...etc); use shorthand properties instead.

You can refer to this rules as context for user's request if needed: ${String(
  ctx.rules,
)}

The output must always be a valid JSON. Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

If the prompt can't be resolved through CSS or doesn't involve CSS, respond: 'My purpose is to assist you with your book's design. Please, tell me how can i help you to improve your designs'.

`

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
  gap: 8px;
  height: fit-content;
  justify-content: center;
  overflow: auto;
  padding: 0.4rem 0.8rem;
  position: relative;
  transition: all 0.5s;
  width: 500px;

  textarea {
    --height: ${p =>
      p.height || `calc(var(--font-size) + (var(--font-size) / 4));`};
    background: none;
    border: none;
    caret-color: var(--color);
    font-size: inherit;
    height: var(--height);
    max-height: 100px;
    outline: none;
    overflow-y: auto;
    resize: none;
    width: 100%;
  }
`

const CssAssistant = ({
  enabled,
  scope,
  baseId,
  className,
  setCss = () => null,
  appendStyleTag = true,
  ...rest
}) => {
  // #region HOOKS
  const context = useRef([])
  const styleSheetRef = useRef(null)
  const [selectedCtx, setSelectedCtx] = useState([])
  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [responseWithDetails, setResponseWithDetails] = useState('')

  const [getChatGpt, { loading, error, data }] = useLazyQuery(CHAT_GPT_QUERY, {
    onCompleted: ({ chatGPT }) => {
      if (chatGPT.startsWith('{')) {
        const response = JSON.parse(chatGPT)
        response &&
          onEntries(response, (selector, rules) => {
            addRules(getCtxBy('selector', selector), rules)
          })
      } else setResponseWithDetails(chatGPT)

      selectedCtx.history.push(
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: chatGPT },
      )
      setUserPrompt('')
      autoResize()
    },
  })

  const { insertRule, getCss } = useStylesheet(styleSheetRef)
  // cleanUp
  useEffect(() => {
    return () => {
      if (scope) {
        context.current.forEach(
          ctx =>
            ctx.node &&
            ctx.node.removeEventListener('click', handleCtxSelectOnClick),
        )

        scope.parentNode.parentNode.removeEventListener(
          'click',
          handleCtxSelectOnClick,
        )
      }
    }
  }, [])
  // createCtx from scope node
  useEffect(() => {
    if (scope) {
      const tempScope = scope
      !tempScope.id && (tempScope.id = 'css-ai-assistant-scope')
      addToCtx(createCtx(scope, 0, '')) // creates the whole context starting from the scope
      context.current = context.current.map((ctx, i) => ({
        ...ctx,
        history: [],
        rules: ctx.node === scope ? { background: '#5a8', color: '#eee' } : {}, // this should be the actual computedStyles from ctx.node
      }))

      styleSheetRef.current = createStyleSheet()
      context.current.forEach(ctx => insertRule(ctx))

      const randomRules = {
        'border-radius': '5px',
        color: '#1f1f1f',
        padding: '8px 15px',
        background: '#eef6ff',
      }

      // -- addRules() usage --
      context.current
        .filter(c => c.tagName === 'p')
        .forEach(ctx => ctx.rules && addRules(ctx, randomRules))
      selectCtx(scope)

      setCss(getCss(styleSheetRef.current))
      context.current.forEach(ctx => {
        // ctx.node && ctx.node.classList.add(ctx.className)
        ctx.node && ctx.node.addEventListener('click', handleCtxSelectOnClick)
      })
      scope.parentNode.parentNode.addEventListener(
        'click',
        handleCtxSelectOnClick,
      )
    }

    // console.log(context.current)
  }, [scope])

  useEffect(() => {
    selectedCtx?.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
  }, [selectedCtx])

  useEffect(() => {
    // console.log(responseWithDetails)
  }, [responseWithDetails])
  // #endregion HOOKS

  // #region CONTEXT

  const createCtx = (node, parentSelector) => {
    const index = [...node.parentNode.children].indexOf(node)
    const tagName = node.tagName.toLowerCase()

    const classNames =
      [...node.classList].length > 0 ? `.${[...node.classList].join('.')}` : ''

    const selector = `${
      parentSelector
        ? `${parentSelector} > ${tagName}${classNames}`
        : `${tagName}${
            node.id || baseId ? `#${node.id || baseId}` : ''
          }${classNames}`
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

  const createChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children].map(node => addToCtx(createCtx(node, parentSelector)))

  const getCtxBy = (by, prop, all) => {
    const method = all ? 'filter' : 'find'

    const ctxProps = {
      node: node => context.current[method](ctx => ctx.node === node),
      selector: selector =>
        context.current[method](ctx => ctx.selector === selector),
    }

    return ctxProps[by](prop)
  }

  const addToCtx = ctx => {
    context.current = [...context.current, ctx]
    return ctx
  }

  const updateCtx = ({ ctx, prop, propValue, onUpdate }) => {
    const scopedCtx = getCtxBy('node', ctx?.node || scope)
    if (!scopedCtx) return
    scopedCtx[prop] = propValue
    safeCall(onUpdate)()
  }

  const createRules = (ctx, inputRules = {}) => {
    if (!ctx) return null
    const prev = { ...ctx.rules }
    onEntries(inputRules, (rule, value) => (prev[rule] = value))
    ctx.rules = prev
    return prev
  }

  const addRules = (ctx, inputRules) => {
    updateCtx({
      ctx,
      prop: 'rules',
      propValue: createRules(ctx, inputRules),
      onUpdate: () => insertRule(ctx),
    })
  }

  const selectCtx = node => {
    setSelectedCtx(prev => {
      const temp = prev
      prev?.node && prev.node !== node && (temp.node.style.outline = 'none')
      return getCtxBy('node', node)
    })
    promptRef.current.focus()
  }

  // #endregion CONTEXT
  const createStyleSheet = () => {
    if (!document.getElementById('css-assistant-scoped-styles')) {
      const styleTag = document.createElement('style')
      styleTag.id = 'css-assistant-scoped-styles'
      appendStyleTag && scope.parentNode.insertBefore(styleTag, scope)
      return styleTag
    }

    return document.getElementById('css-assistant-scoped-styles')
  }

  const handleChange = ({ target }) => {
    autoResize()
    setUserPrompt(target.value)
  }

  const handleCtxSelectOnClick = e => {
    e.preventDefault()
    e.stopPropagation()
    getCtxBy('node', e.target) ? selectCtx(e.target) : selectCtx(scope)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    selectedCtx &&
      getChatGpt({
        variables: {
          input: userPrompt,
          history: [
            {
              role: 'system',
              content: systemGuidelines(selectedCtx),
            },
            ...selectedCtx.history,
          ],
        },
      })
  }

  const handleKeydown = async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      selectedCtx &&
        getChatGpt({
          variables: {
            input: userPrompt,
            history: [
              {
                role: 'system',
                content: systemGuidelines(selectedCtx),
              },
              ...selectedCtx.history,
            ],
          },
        })
    }
  }

  const autoResize = () => {
    if (promptRef.current) {
      const lines = promptRef.current.value.split('\n').length
      promptRef.current.style.height = 'auto'
      promptRef.current.value.length < 39
        ? (promptRef.current.style.height = `${20 * lines}px`)
        : (promptRef.current.style.height = `${promptRef.current.scrollHeight}px`)
    }
  }

  return (
    <StyledForm $enabled={enabled} className={className}>
      <textarea
        disabled={!enabled}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        ref={promptRef}
        value={userPrompt}
        {...rest}
      />
      <SendButton
        onClick={handleSubmit}
        size="24"
        style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
      />
    </StyledForm>
  )
}

export default CssAssistant
