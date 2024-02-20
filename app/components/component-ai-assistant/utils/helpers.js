import { ALLOWED_PROPS, previewOnlyCSS } from './constants'
import { mapEntries, onEntries, values } from './utils'

export const srcdoc = (scope, css) => /* html */ `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
      <style>
        ${css.replace('#body', 'body') || ''}
        ${previewOnlyCSS}
      </style>
    </head>
    <body id="body">
      ${scope.outerHTML}
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          const scopeIsReady = document.getElementById("css-assistant-scope")
          scopeIsReady && PagedPolyfill.preview(scopeIsReady);
        });
      </script>
    </body>
    </html>
  `

export const safeKey = (name, object) => {
  let finalName = name

  Object.keys(object).forEach(key => {
    if (key === name) {
      let prefix = 1

      while (object[`${name}_${prefix}`]) {
        prefix += 1
      }

      finalName = `${name}_${prefix}`
    }
  })
  return finalName
}

export const getComputedRule = el =>
  values(window.getComputedStyle(el))
    .map(
      val =>
        getComputedStyle(el).getPropertyValue(val) &&
        ALLOWED_PROPS.includes(val) && {
          rule: val,
          value: getComputedStyle(el).getPropertyValue(val),
        },
    )
    .filter(Boolean)

export const cssStringToObject = cssString => {
  const cssObject = {}
  const ruleSets = cssString.split('}')

  ruleSets.forEach(ruleSet => {
    if (!ruleSet) return
    const [selector = '', rules = ''] = ruleSet.split('{')

    const trimmedSelector = selector.trim()
    const trimmedRules = rules.trim().slice(0, -1)

    const declarations = trimmedRules.split(';')

    cssObject[trimmedSelector] = {}

    declarations.forEach(declaration => {
      const [property = '', value = ''] = declaration.split(':')

      if (property && value) {
        cssObject[trimmedSelector][property.trim()] = value.trim()
      }
    })
  })
  return cssObject
}

export const generateCSS = (styles, parentSelector = '') => {
  return mapEntries(styles, (selector, properties) => {
    const fullSelector = parentSelector
      ? `${parentSelector} ${selector}`
      : selector

    if (typeof properties === 'object' && properties !== null) {
      return generateCSS(properties, fullSelector)
    }

    return `${fullSelector} { ${properties} }\n`
  }).join('')
}

export const styleHtmlString = (source, style) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(source, 'text/html')

  const headElement = doc.querySelector('head')
  const styleElement = document.createElement('style')
  styleElement.textContent = style

  headElement.appendChild(styleElement)

  return doc.documentElement.outerHTML
}

export const setInlineStyle = (node, styles) => {
  const nodeRef = node
  onEntries(styles, (k, v) => {
    nodeRef.style[k] = v
  })
}
