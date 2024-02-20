/* eslint-disable no-unused-vars */
import React, { createContext, useRef, useState } from 'react'
import { safeCall } from '../utils'

export const CssAssistantContext = createContext()

export const CssAssistantProvider = ({ children }) => {
  const context = useRef([])
  const styleSheetRef = useRef(null)
  const history = useRef({ active: true, index: 0 })

  const [selectedCtx, setSelectedCtx] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)

  const [html, setHtml] = useState(null)
  const [css, setCss] = useState(null)

  const [feedback, setFeedback] = useState('')

  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')

  const createStyleSheet = (
    onCreate = styleTag => html.parentNode.insertBefore(styleTag, html), // we can optionally change this cb for more customization
  ) => {
    if (!document.getElementById('css-assistant-scoped-styles')) {
      const styleTag = document.createElement('style')
      styleTag.id = 'css-assistant-scoped-styles'
      safeCall(onCreate)(styleTag)
      return styleTag
    }

    return document.getElementById('css-assistant-scoped-styles')
  }

  const dom = {
    promptRef,
    styleSheetRef,
    selectedNode,
    createStyleSheet,
  }

  const ctx = {
    context,
    history,
    selectedCtx,
    setSelectedCtx,
    setSelectedNode,
  }

  const chatGpt = {
    feedback,
    userPrompt,
    setFeedback,
    setUserPrompt,
  }

  const htmlAndCss = {
    css,
    html,
    setCss,
    setHtml,
  }

  return (
    <CssAssistantContext.Provider
      value={{ ...htmlAndCss, ...dom, ...ctx, ...chatGpt }}
    >
      {children}
    </CssAssistantContext.Provider>
  )
}
