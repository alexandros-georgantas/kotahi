// /* eslint-disable no-underscore-dangle */
// const { API_KEY } = process.env

// export const onEntries = (obj, cb) => {
//   Object.entries(obj).forEach(([k, v]) => cb(k, v))
// }

// const styles = /* css */ `
// textarea {
//     background: none;
//     height: 18px;
//     resize: none;
//     border: none;
//     outline: none;
//     font-size: inherit;
//     caret-color: #056b05;
// }
// `

// const systemGuidelines = ctx => () => `

// You are a CSS, JS and HTML expert, your task is to interpret which changes the 'user' wants to do on a css property from an html tag.

// You must retain the contex of the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.

// Keep in mind that 'user' might not know css, so the prompt must be analysed carefully in order to complete the task.

// [htmlTagName] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${Object.keys(
//   ctx.currentCtx.rules,
// ).join(
//   ', ',
// )}], If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "*" as default value. This variable represents the HTML element whose CSS properties need to be changed.

// Provide a CSS rule and its value in the following JSON format: {"htmlTagName": {"cssRuleInCamelCase": "validCSSValue"}, ...moreRulesIfMoreHtmlElementsAreInvolved}.

// Use hex for colors and px units for sizes.

// You cannot use individual properties, like ('backgroundImage', 'backgroundColor', 'borderColor', ...etc); use shorthand properties instead.

// You can refer to this rules as context for user's request if needed: ${String(
//   ctx.currentCtx.rules,
// )}

// The output must always be a valid JSON. Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

// If the prompt can't be resolved through CSS or doesn't involve CSS, respond: 'My purpose is to assist you with your book's design. Please, tell me how can i help you to improve your designs'.

// `

// // TODO: move this to the instance and add all childs to contexts list
// function Rules(elementCtx, newRules = {}) {
//   const rules = { '*': {} }

//   const elementsInCtx =
//     elementCtx instanceof HTMLElement
//       ? [...elementCtx.querySelectorAll('*')].map(({ tagName }) => tagName)
//       : AllowedElements

//   elementsInCtx.forEach(tag => (rules[tag] = newRules))
//   return rules
// }

// const AllowedElements = ['p', 'h1', 'h2', 'div', 'span', 'section', 'hr']

// export class CssAssistant extends HTMLElement {
//   // #region privates & static
//   _shadow
//   _systemGuidelines
//   _promptsCtx = [
//     { element: null, rules: new Rules(this.ctxElement), history: [] },
//   ]

//   _prompt
//   _style
//   _enabled = true

//   static get observedAttributes() {
//     return ['context', 'area-width']
//   }
//   // #endregion privates & static

//   constructor() {
//     super()
//     this._shadow = this.attachShadow({ mode: 'open' })
//     this._prompt = document.createElement('textarea')
//     this._style = document.createElement('style')
//     this._prompt.addEventListener('load', this.autoResize, false)
//     this._systemGuidelines = systemGuidelines
//     this.showError = null // this is a function to pass when the prompt doesent involve css take the prompt response contetnt as the only param
//     // this.onPromptError = err => console.log(err)

//     this.onSelect = node => {
//       const el = node
//       el.style.outline = '2px dashed #07c157'
//       el.style.outlineOffset = '5px'
//     }
//   }

//   // #region lifeCycle
//   connectedCallback() {
//     this._style.innerHTML = this.areaStyle || styles
//     this._shadow.appendChild(this._style)
//     this._shadow.appendChild(this._prompt)
//     this._prompt.placeholder = this.getAttribute('placeholder')
//     this._prompt.style.width = this.area.width || '200px'
//     this._prompt.style.minWidth = this.area.minWidth || '100%'
//     this._prompt.addEventListener('input', this.autoResize, false)
//     this.addEventListener('keydown', this.onKeydown)
//     this.makeSelectableAllElementsInCtx()
//     this._promptsCtx[0].element = this.ctxElement
//     this._promptsCtx[0].rules = new Rules(this.ctxElement)

//     // eslint-disable-next-line prefer-destructuring
//     this.currentCtx = this._promptsCtx[0]
//   }

//   disconnectedCallback() {
//     this._prompt.removeEventListener('load', this.autoResize)
//     this._prompt.removeEventListener('input', this.autoResize)
//     this.removeEventListener('keydown', this.onKeydown)
//   }
//   // #endregion lifeCycle

//   // #region getters & setters
//   // TODO: Method for set&get all properties(private included) in order to control changes
//   /**
//    * @param {boolean} value
//    */
//   set enabled(value) {
//     this._enabled = value
//     this._prompt.disabled = !value
//   }

//   get enabled() {
//     return this._enabled
//   }

//   get area() {
//     return {
//       width: this.getAttribute('area-width'),
//       minWidth: this.getAttribute('area-min-width'),
//     }
//   }

//   get ctxElement() {
//     return (
//       this.currentCtx?.element ||
//       document.querySelector(this.getAttribute('context'))
//     )
//   }
//   // #endregion getters

//   // #region API
//   async conversation() {
//     const res = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: this._systemGuidelines(this),
//           },
//           ...this.currentCtx.history,
//         ],
//       }),
//     })

//     const data = await res.json()
//     this.currentCtx.history.push(data.choices[0].message)
//     const { content } = data.choices[0].message
//     return { data, content }
//   }

//   async sendPrompt() {
//     if (!this._prompt.value || !this._enabled) return
//     this.currentCtx.history.push({ role: 'user', content: this._prompt.value })

//     try {
//       const { content } = await this.conversation()

//       !content.includes('{')
//         ? typeof this.showError === 'function' && this.showError(content)
//         : this.addRules(content)
//     } catch (err) {
//       this.currentCtx.history.pop()
//       typeof this.onPromptFailed === 'function' && this.onPromptFailed(err)
//     } finally {
//       this.autoResize.bind(this._prompt)
//       this._prompt.value = ''
//       this._prompt.focus()
//     }
//   }
//   // #endregion API

//   // #region response handlers
//   addRules(rulesFromResponse) {
//     const newRules = JSON.parse(rulesFromResponse)
//     onEntries(newRules, (k, v) => v && (this.currentCtx.rules[k] = v))
//     onEntries(this.currentCtx.rules, element => {
//       const parent = this.ctxElement
//       let el = parent.querySelector(element)
//         ? parent.querySelector(element)
//         : parent
//       element === '*' && (el = parent)

//       const currentElementCssProps = this.currentCtx.rules[element]
//       el && onEntries(currentElementCssProps, (k, v) => (el.style[k] = v))
//     })
//   }

//   // #endregion response handlers

//   // #region handlers
//   selectNode(node) {
//     this.ctxElement.style.outline = 'none'
//     if (!this._enabled) return

//     if (node instanceof HTMLElement) {
//       this.addNodeToContext(node)
//       this.currentCtx = this.findCtxByNode(node)
//     } else {
//       const [firstContext] = this._promptsCtx
//       this.currentCtx = firstContext
//     }

//     // TODO: create a element to display selection instead
//     this.onSelect(this.currentCtx.element)
//     this._prompt.focus()
//   }

//   onKeydown = e => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       this.sendPrompt()
//     }
//   }

//   makeSelectableAllElementsInCtx() {
//     this.ctxElement.querySelectorAll('*').forEach(el =>
//       el.addEventListener('click', e => {
//         e.stopPropagation()
//         this.selectNode(el)
//       }),
//     )
//     document.querySelector('body').addEventListener('click', e => {
//       e.stopPropagation()
//       e.target !== this && this.selectNode(null)
//     })
//   }
//   // #endregion handlers

//   // #region helpers
//   addNodeToContext(node) {
//     !this.findCtxByNode(node) &&
//       this._promptsCtx.push({
//         element: node,
//         rules: new Rules(node),
//         history: [],
//       })
//   }

//   findCtxByNode(node) {
//     return this._promptsCtx.find(elm => elm.element === node)
//   }

//   // autoResize() {
//   //   this.style.height = getComputed(this, 'font-size')
//   //   this.style.height = `${this.scrollHeight}px`
//   // }
//   // #endregion helpers
// }

// window.customElements.define('css-assistant', CssAssistant)
