/* eslint-disable no-nested-ternary */
import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import { rotate360 } from '@pubsweet/ui-toolkit'
import { debounce } from 'lodash'
import {
  autoResize,
  callOn,
  onEntries,
  setInlineStyle,
  systemGuidelinesV2,
} from './utils'
import SendIcon from './SendButton'
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

const SendButton = styled.button`
  aspect-ratio: 1 /1;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  width: 24px;

  > svg {
    fill: ${color.brand1.base};
    transform: scale(1.35);
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
  // #region HOOKS ---------------------------------------------------------------------
  const {
    styleSheetRef,
    context,
    setCss,
    htmlSrc,
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

  const [getChatGpt, { loading, error }] = useLazyQuery(CHAT_GPT_QUERY, {
    onCompleted: ({ chatGPT }) => {
      if (chatGPT.startsWith('{')) {
        const response = JSON.parse(chatGPT)
        const { css, json, feedback } = response
        const ctxIsHtmlSrc = selectedCtx.node === htmlSrc

        if (json && !ctxIsHtmlSrc) {
          addRules(selectedCtx, json)
          setInlineStyle(selectedCtx.node, json)
        } else if (css) {
          styleSheetRef.current.textContent += css
          setCss(styleSheetRef.current.textContent)
        }

        feedback && setFeedback(feedback)

        selectedCtx.history.push({ role: 'assistant', content: feedback })
      } else {
        setFeedback(chatGPT)
        selectedCtx.history.push({ role: 'assistant', content: chatGPT })
      }
    },
  })

  useEffect(() => {
    if (htmlSrc) {
      const tempScope = htmlSrc
      !tempScope.id && (tempScope.id = 'assistant-ctx')
      const allChilds = [...htmlSrc.children]

      addToCtx(newCtx(htmlSrc))
      styleSheetRef.current = createStyleSheet(styleTag =>
        htmlSrc.parentNode.insertBefore(styleTag, htmlSrc),
      )
      stylesFromSource &&
        (styleSheetRef.current.textContent += stylesFromSource)

      setSelectedCtx(getCtxBy('node', htmlSrc))
      setSelectedNode(htmlSrc)
      setCss(styleSheetRef.current.textContent)
      allChilds.forEach(child =>
        child.addEventListener('click', handleSelection),
      )
      htmlSrc.parentNode.parentNode.addEventListener('click', handleSelection)
    }
  }, [htmlSrc])

  useEffect(() => {
    return () => {
      if (htmlSrc) {
        ;[...htmlSrc.children].forEach(child =>
          child.removeEventListener('click', handleSelection),
        )
        htmlSrc.parentNode.parentNode.removeEventListener(
          'click',
          handleSelection,
        )
      }
    }
  }, [])

  useEffect(() => {
    error &&
      setFeedback('Something went wrong, please check your internet connection')
  }, [error])

  // #endregion HOOKS

  // #region CONTEXT -------------------------------------------------------------------

  const newCtx = (node, parent, rules = {}, addSelector = true) => {
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

    newChildsCtx(node, selector)
    return {
      selector: addSelector ? selector : '',
      node,
      tagName,
      rules,
      history: [],
    }
  }

  const newChildsCtx = (ctxNode, parentSelector) =>
    [...ctxNode.children]
      .map(node => addToCtx(newCtx(node, parentSelector)))
      .filter(Boolean)

  const addToCtx = ctx => {
    if (ctx.selector && getCtxBy('selector', ctx.selector)) return false
    context.current = [...context.current, ctx]
    return ctx
  }

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

  const addRules = (ctx, inputRules = {}) => {
    if (!ctx) return null
    const rules = { ...ctx.rules }
    onEntries(inputRules, (rule, value) => (rules[rule] = value))
    ctx.rules = rules

    return rules
  }

  // #endregion CONTEXT

  // #region HANDLERS ------------------------------------------------------------------

  const handleChange = ({ target }) => {
    setUserPrompt(target.value)
    debouncedResize()
  }

  const handleSelection = e => {
    e.preventDefault()
    e.stopPropagation()

    if (htmlSrc.contains(e.target)) {
      const ctx =
        getCtxBy('node', e.target) ||
        addToCtx(newCtx(e.target, null, {}, false))

      setSelectedCtx(ctx)
      setSelectedNode(e.target)
    } else {
      setSelectedCtx(getCtxBy('node', htmlSrc))
      setSelectedNode(htmlSrc)
    }

    // console.log(context.current)
    promptRef.current.focus()
  }

  const handleSend = async e => {
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
                  selectedCtx || getCtxBy('node', htmlSrc),
                  styleSheetRef?.current?.textContent,
                  [
                    ...new Set(
                      context.current
                        .map(({ selector }) => selector)
                        .filter(Boolean),
                    ),
                  ].join(', '),
                ),
              },
              ...selectedCtx.history,
              {
                role: 'user',
                content: `${userPrompt} (always respond with the valid JSON, all strings must be enclosed in double quotes, and any double quotes within the string must be escaped with a backslash`,
              },
            ],
          },
        })
      : setFeedback('Please, tell me what you want to do')
    selectedCtx.history.push({ role: 'user', content: userPrompt })
    setUserPrompt('')
  }

  const handleKeydown = async e => {
    callOn(e.key, {
      Enter: () => !e.shiftKey && handleSend(e),
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
        <SendButton onClick={handleSend}>
          <SendIcon size="18" />
        </SendButton>
      )}
    </StyledForm>
  )
}

export default CssAssistant
