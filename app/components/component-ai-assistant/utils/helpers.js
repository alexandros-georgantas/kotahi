import { ALLOWED_PROPS } from './constants'

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

export const styleHtmlString = (source, style) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(source, 'text/html')

  const headElement = doc.querySelector('head')
  const styleElement = document.createElement('style')
  styleElement.innerHTML = style

  headElement.appendChild(styleElement)

  return doc.documentElement.outerHTML
}

export const toSnake = key =>
  key
    .split(/(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')
/**
 * Checks if the provided callback is a function.
 *
 * @param {*} cb - The callback to check.
 * @returns {boolean} - Returns true if the callback is a function, false otherwise.
 */
export const isFunction = cb => typeof cb === 'function'

/**
 * Safely calls the provided callback if it's a function, otherwise returns the fallback function.
 *
 * @param {function} cb - The callback to call if it's a function.
 * @param {function} fb - The fallback function to return if the callback is not a function.
 * @returns {function} - Returns the callback if it's a function, otherwise returns the fallback function.
 */
export const safeCall = (cb, fb) =>
  // eslint-disable-next-line no-nested-ternary
  isFunction(cb) ? cb : isFunction(fb) ? fb : () => {}

/**
 * Returns the function specified by the key in the options object if it's a function, otherwise returns the fallback function.
 *
 * @param {string} key - A string to check if matches a key from the options object.
 * @param {{}} options - The options object containing (or not) the function to return.
 * @param {Array} params - An array of params to spread to each function.
 * @returns {function} - Returns the function specified by the key if it's a function, otherwise returns the fallback function.
 * @example
 *  const data = 3 // define the data as a number
 *
 *  callOn(typeof data, {
 *    number: (n) => data + n,
 *    string: (n) => console.log(`${n} is a string!`)
 *    default: () => console.log(`no key matching to handle ${n}`)
 *  }, [5])
 *
 * // returns 8
 *
 *  const data = '3' // define the data as a string
 *
 *  callOn(typeof data, {
 *    number: (n) => data + n,
 *    string: (n) => console.log(`${n} is a string!`)
 *    default: (n) => console.log(`no key matching to handle ${n}`)
 *  }, [5])
 *
 * // show in console: `3 is a string!`
 *
 *  const data = [] // define the data as anything else
 *
 *  callOn(typeof data, {
 *    number: (n) => data + n,
 *    string: (n) => console.log(`${n} is a string!`)
 *    default: (n) => console.log(`no key matching to handle ${n}`)
 *  },[5])
 *
 * // show in console: `no key matching to handle 5`
 */
export const callOn = (key, options, params = []) =>
  safeCall(options[key], options.default || (() => null))(...params)

export const keys = obj => Object.keys(obj)
export const values = obj => Object.values(obj)
export const entries = obj => Object.entries(obj)

export const onEntries = (obj, cb) => entries(obj).forEach(([k, v]) => cb(k, v))
export const mapEntries = (obj, cb) => entries(obj).map(([k, v]) => cb(k, v))
export const filterEntries = (obj, cb) =>
  entries(obj).filter(([k, v]) => cb(k, v))

export const onKeys = (obj, cb) => keys(obj).forEach(cb)
export const mapKeys = (obj, cb) => keys(obj).map(cb)
export const filterKeys = (obj, cb) => keys(obj).filter(cb)

export const onValues = (obj, cb) => values(obj).forEach(cb)
export const mapValues = (obj, cb) => values(obj).map(cb)
export const filterValues = (obj, cb) => values(obj).filter(cb)
