/* eslint-disable no-unused-vars */
import React, { createContext, useMemo, useRef, useState } from 'react'
import { safeCall } from '../utils'
import useStylesheet from './useStyleSheet'

export const CssAssistantContext = createContext()

export const CssAssistantProvider = ({ children }) => {
  const context = useRef([])
  const styleSheetRef = useRef(null)
  const history = useRef({ active: true, index: 0 })
  const { insertRule, makeCss } = useStylesheet(styleSheetRef)

  const [selectedCtx, setSelectedCtx] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)

  const [htmlSrc, setHtmlSrc] = useState(null)
  const [css, setCss] = useState(null)

  const [feedback, setFeedback] = useState('')

  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')

  const createStyleSheet = (
    onCreate, // we can optionally change this cb for more customization
  ) => {
    if (!document.getElementById('css-assistant-scoped-styles')) {
      const styleTag = document.createElement('style')
      styleTag.id = 'css-assistant-scoped-styles'
      safeCall(onCreate)(styleTag)
      return styleTag
    }

    return document.getElementById('css-assistant-scoped-styles')
  }

  const dom = useMemo(() => {
    return {
      promptRef,
      styleSheetRef,
      createStyleSheet,
      insertRule,
      makeCss,
    }
  }, [styleSheetRef, promptRef])

  const ctx = useMemo(() => {
    return {
      context,
      history,
      selectedNode,
      selectedCtx,
      setSelectedCtx,
      setSelectedNode,
    }
  }, [context, history, selectedCtx, selectedNode])

  const chatGpt = useMemo(() => {
    return {
      feedback,
      userPrompt,
      setFeedback,
      setUserPrompt,
    }
  }, [feedback, userPrompt])

  const htmlAndCss = useMemo(() => {
    return {
      css,
      htmlSrc,
      setCss,
      setHtmlSrc,
    }
  }, [css, htmlSrc])

  return (
    <CssAssistantContext.Provider
      value={{ ...htmlAndCss, ...dom, ...ctx, ...chatGpt }}
    >
      {children}
    </CssAssistantContext.Provider>
  )
}
