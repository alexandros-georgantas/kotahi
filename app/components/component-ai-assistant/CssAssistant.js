/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './CssAssistantWC'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import { rotate360 } from '@pubsweet/ui-toolkit'
import useStylesheet from './hooks/useStyleSheet'
import { onEntries, safeCall } from './utils/helpers'
import SendButton from './SendButton'
import { color } from '../../theme'
import ResponsesUi from './ResponsesUi'

const CHAT_GPT_QUERY = gql`
  query ChatGpt($input: String!, $history: [ChatGptMessage!]) {
    chatGPT(input: $input, history: $history)
  }
`

const getSelectorsRecursively = ctx => {
  const finalOutput = [ctx.selector]

  ctx.childs.forEach(
    child =>
      child?.selector &&
      !finalOutput.includes(child.selector) &&
      finalOutput.push(child.selector),
  )

  return finalOutput
}

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

You must never say to user what to code, you must return the valid JSOn or in other case ask user again to improve his promt in order to help you to style his article. but always as a result must be the json output, not a suggestion

If the prompt can't be resolved through CSS or doesn't involve CSS, respond: 'My purpose is to assist you with your article's design. Please, tell me how can i help you to improve your designs'.

`

const StyledForm = styled.form`
  --color: #2fac66;
  --color-border: #0004;
  --font-size: 14px;
  align-items: center;
  background-color: #fffe;
  border: 1px solid var(--color-border);
  border-radius: 5px;
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
    /* border-bottom: 1px solid #0002; */
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

const StyledSpinner = styled.div`
  display: flex;
  height: fit-content;
  width: 24px;

  &:after {
    animation: ${rotate360} 1s linear infinite;
    border: 2px solid ${color.brand1.base};
    border-color: ${color.brand1.base} transparent ${color.brand1.base}
      transparent;
    border-radius: 50%;
    content: ' ';
    display: block;
    height: 18px;
    margin: 1px;
    width: 18px;
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
            getCtxBy('selector', selector)
              ? addRules(getCtxBy('selector', selector), rules)
              : insertRule({ selector, rules })
          })
        setResponseWithDetails('Here you go!')
      } else setResponseWithDetails(chatGPT)

      selectedCtx.history.push(
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: chatGPT },
      )
      setUserPrompt('')
    },
  })

  const { insertRule, getCss } = useStylesheet(styleSheetRef)
  // cleanUp
  useEffect(() => {
    return () => {
      if (scope) {
        scope.removeEventListener('click', handleCtxSelectOnClick)
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
      // TODO: dont't create the whole context, await until user clicks on the element to scope
      addToCtx(createCtx(scope, 0)) // creates the whole context starting from the scope
      context.current = context.current.map((ctx, i) => ({
        ...ctx,
        history: [],
        rules: {},
      }))

      styleSheetRef.current = createStyleSheet()
      // TODO: dont' create rules until they exists, same for selectors
      context.current.forEach(
        ctx =>
          Object.values(ctx.rules).map(rule => rule).length > 0 &&
          insertRule(ctx),
      )

      selectCtx(scope)

      setCss(getCss())
      scope.addEventListener('click', handleCtxSelectOnClick)
      scope.parentNode.parentNode.addEventListener(
        'click',
        handleCtxSelectOnClick,
      )
      // console.log(context.current)
    }
  }, [scope])

  useEffect(() => {
    selectedCtx?.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
  }, [selectedCtx])

  useEffect(() => {
    autoResize()
  }, [userPrompt])
  // #endregion HOOKS

  // #region CONTEXT

  const createCtx = (node, parent) => {
    const index = [...node.parentNode.children].indexOf(node)
    const tagName = node.tagName.toLowerCase()

    const parentSelector = !parent
      ? getCtxBy('node', node.parentNode)?.selector || ''
      : parent

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
      history: [],
    }
  }

  const createChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children]
      .map(node => addToCtx(createCtx(node, parentSelector)))
      .filter(Boolean)

  const getCtxBy = (by, prop, all) => {
    const method = all ? 'filter' : 'find'

    const ctxProps = {
      node: node => context.current[method](ctx => ctx.node === node),
      selector: selector =>
        context.current[method](ctx => ctx.selector === selector),
      tagName: tag => context.current[method](ctx => ctx.tagName === tag),
    }

    return ctxProps[by](prop)
  }

  const addToCtx = (ctx, isChild) => {
    if (isChild) return ctx
    if (getCtxBy('selector', ctx.selector)) return false
    context.current = [...context.current, ctx]
    return ctx
  }

  const updateCtx = ({ ctx, prop, propValue, onUpdate }) => {
    const scopedCtx = getCtxBy('node', ctx?.node || scope)
    if (!scopedCtx) return
    scopedCtx[prop] = propValue
    safeCall(onUpdate)()
  }

  const addRulesToCtx = (ctx, inputRules = {}) => {
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
      propValue: addRulesToCtx(ctx, inputRules),
      onUpdate: () => insertRule(ctx),
    })
    selectedCtx?.node && (selectedCtx.node.style.outline = 'none')
    setCss(getCss())
    selectedCtx?.node && (selectedCtx.node.style.outline = '1px dashed #5d5')
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
    setUserPrompt(target.value)
  }

  const handleCtxSelectOnClick = e => {
    e.preventDefault()
    e.stopPropagation()
    !getCtxBy('node', e.target) && addToCtx(createCtx(e.target))
    selectCtx(e.target)
    // console.log(context.current)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    userPrompt && setResponseWithDetails('Just give me a few seconds')
    userPrompt
      ? getChatGpt({
          variables: {
            input: userPrompt,
            history: [
              {
                role: 'system',
                content: systemGuidelines(
                  selectedCtx || getCtxBy('node', scope),
                ),
              },
              ...selectedCtx.history,
            ],
          },
        })
      : setResponseWithDetails('Please, tell me what you want to do')
  }

  const handleKeydown = async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }

    if (e.key === 'ArrowDown') {
      const userHistory = selectedCtx.history.filter(v => v.role === 'user')
      userHistory.length > 0 &&
        !userPrompt &&
        setUserPrompt(userHistory[userHistory.length - 1].content)
    }
  }

  const autoResize = () => {
    if (promptRef.current) {
      const lines = promptRef.current.value.split('\n').length
      promptRef.current.style.height = 'auto'
      promptRef.current.value.length < 39
        ? (promptRef.current.style.height = `${16 * lines}px`)
        : (promptRef.current.style.height = `${promptRef.current.scrollHeight}px`)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5px',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <StyledForm $enabled={enabled} className={className}>
          <textarea
            disabled={!enabled}
            onChange={handleChange}
            onKeyDown={handleKeydown}
            ref={promptRef}
            value={userPrompt}
            {...rest}
          />
          {loading ? (
            <StyledSpinner />
          ) : (
            <SendButton
              fill={color.brand1.base()}
              onClick={handleSubmit}
              size="24"
              style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
            />
          )}
        </StyledForm>
      </span>
      <ResponsesUi
        promptRef={promptRef}
        responseWithDetails={responseWithDetails}
        setUserPrompt={setUserPrompt}
      />
    </div>
  )
}

export default CssAssistant
