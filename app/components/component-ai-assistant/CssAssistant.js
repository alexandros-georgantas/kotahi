/* eslint-disable no-nested-ternary */
import React, { useEffect, useLayoutEffect, useContext } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import { rotate360 } from '@pubsweet/ui-toolkit'
import { debounce } from 'lodash'
import useStylesheet from './hooks/useStyleSheet'
import {
  autoResize,
  callOn,
  onEntries,
  safeCall,
  setInlineStyle,
  systemGuidelinesV2,
} from './utils'
import SendButton from './SendButton'
import { color } from '../../theme'
import { CssAssistantContext } from './hooks/CssAssistantContext'

const CHAT_GPT_QUERY = gql`
  query ChatGpt($input: String!, $history: [ChatGptMessage!]) {
    chatGPT(input: $input, history: $history)
  }
`

const StyledForm = styled.form`
  --color: ${color.brand1.base};
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
  baseId,
  className,
  stylesFromSource,
  appendStyleTag = true,
  ...rest
}) => {
  // #region HOOKS
  const {
    styleSheetRef,
    context,
    setCss,
    html,
    selectedCtx,
    setSelectedCtx,
    setSelectedNode,
    setFeedback,
    history,
    userPrompt,
    setUserPrompt,
    promptRef,
    createStyleSheet,
  } = useContext(CssAssistantContext)

  const { insertRule, getCss } = useStylesheet(styleSheetRef)

  const [getChatGpt, { loading, error }] = useLazyQuery(CHAT_GPT_QUERY, {
    onCompleted: ({ chatGPT }) => {
      if (chatGPT.startsWith('{')) {
        const response = JSON.parse(chatGPT)
        response &&
          onEntries(response, (selector, rules) => {
            if (selectedCtx.node === html) {
              getCtxBy('selector', selector)
                ? addRules(getCtxBy('selector', selector), rules)
                : insertRule({ selector, rules })
            } else {
              setInlineStyle(selectedCtx.node, rules)
              addRulesToCtx(selectedCtx, rules)
            }
          })
        setCss(getCss())
        setFeedback('Here you go!')
      } else
        setFeedback(
          chatGPT.includes('{')
            ? `Please, can you provide more precise instructions?`
            : chatGPT,
        )

      selectedCtx.history.push(
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: chatGPT },
      )
      setUserPrompt('')
    },
  })

  useEffect(() => {
    if (html) {
      const tempScope = html
      !tempScope.id && (tempScope.id = 'css-ai-assistant-scope')
      addToCtx(createCtx(html, 0))
      context.current = context.current.map(ctx => ({
        ...ctx,
        history: [],
        rules: {},
      }))

      styleSheetRef.current = createStyleSheet()
      context.current.forEach(
        ctx =>
          Object.values(ctx.rules).map(rule => rule).length > 0 &&
          insertRule(ctx),
      )

      setSelectedCtx(getCtxBy('node', html))

      setCss(getCss())
      ;[...html.children].forEach(child =>
        child.addEventListener('click', handleSelection),
      )
      html.parentNode.parentNode.addEventListener('click', handleSelection)
      // console.log(context.current)
    }
  }, [html])
  // cleanUp
  useEffect(() => {
    return () => {
      if (html) {
        ;[...html.children].forEach(child =>
          child.removeEventListener('click', handleSelection),
        )
        html.parentNode.parentNode.removeEventListener('click', handleSelection)
      }
    }
  }, [])
  useEffect(() => {
    styleSheetRef?.current &&
      stylesFromSource &&
      onEntries(stylesFromSource, (selector, rules) => {
        getCtxBy('selector', selector)
          ? addRules(getCtxBy('selector', selector), rules)
          : insertRule({ selector, rules })
      })
  }, [stylesFromSource])

  useEffect(() => {
    error &&
      setFeedback('Something went wrong, please check your internet connection')
  }, [error])

  useLayoutEffect(() => {
    debouncedResize()
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
      default: node => context.current[method](ctx => ctx.node === node),
    }

    return callOn(by, ctxProps, [prop])
  }

  const addToCtx = (ctx, isChild) => {
    if (isChild) return ctx
    if (getCtxBy('selector', ctx.selector)) return false
    context.current = [...context.current, ctx]
    return ctx
  }

  const updateCtx = ({ prop, propValue, onUpdate }) => {
    if (!selectedCtx) return
    selectedCtx[prop] = propValue
    safeCall(onUpdate)()
  }

  const addRulesToCtx = (ctx, inputRules = {}) => {
    if (!ctx) return null
    const rules = { ...ctx.rules }
    onEntries(inputRules, (rule, value) => (rules[rule] = value))
    ctx.rules = rules
    return rules
  }

  const addRules = (ctx, inputRules) => {
    updateCtx({
      prop: 'rules',
      propValue: addRulesToCtx(ctx, inputRules),
      onUpdate: () => insertRule(ctx),
    })
    setCss(getCss())
  }
  // #endregion CONTEXT

  // #region HANDLERS
  const handleChange = ({ target }) => {
    setUserPrompt(target.value)
  }

  const handleSelection = e => {
    e.preventDefault()
    e.stopPropagation()

    if (html.contains(e.target)) {
      setSelectedCtx(getCtxBy('node', e.target))
      setSelectedNode(e.target)
    } else {
      setSelectedCtx(getCtxBy('node', html))
      setSelectedNode(html)
    }

    promptRef.current.focus()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    userPrompt && setFeedback('Just give me a few seconds')
    userPrompt
      ? getChatGpt({
          variables: {
            input: userPrompt,
            history: [
              {
                role: 'system',
                content: systemGuidelinesV2(
                  selectedCtx || getCtxBy('node', html),
                  getCss(),
                ),
              },
              ...selectedCtx.history,
            ],
          },
        })
      : setFeedback('Please, tell me what you want to do')
  }

  const handleKeydown = async e => {
    callOn(e.key, {
      Enter: () => !e.shiftKey && handleSubmit(e),
      ArrowDown: () => {
        const userHistory = selectedCtx.history.filter(v => v.role === 'user')
        if (userHistory.length < 1) return
        history.current.index > 0
          ? (history.current.index -= 1)
          : (history.current.index = userHistory.length - 1)

        history.current.active &&
          setUserPrompt(userHistory[history.current.index].content)
        history.current.active = true
      },
      default: () => history.current.active && (history.current.active = false),
    })
  }
  // #endregion HANDLERS

  const debouncedResize = debounce(() => {
    autoResize(promptRef.current)
  }, 200)

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
  )
}

export default CssAssistant
