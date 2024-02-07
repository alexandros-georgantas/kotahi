import { useCallback } from 'react'

const useStylesheets = sheet => {
  const insertRule = useCallback(
    ({ selector, rule, value }) => {
      const ruleString = `${selector} { ${rule}: ${value}; }`

      try {
        sheet.insertRule(ruleString, sheet.cssRules.length)
      } catch (error) {
        console.error('Error inserting rule: ', error)
      }
    },
    [sheet],
  )

  const updateRule = useCallback(
    ({ selector, rule, value }) => {
      ;[...sheet.cssRules].forEach(cssRule => {
        if (cssRule.selectorText === selector && cssRule.style[rule]) {
          // eslint-disable-next-line no-param-reassign
          cssRule.style[rule] = value
        }
      })
    },
    [sheet],
  )

  const deleteRule = useCallback(
    (selector, rule) => {
      ;[...sheet.cssRules].forEach((cssRule, index) => {
        if (cssRule.selectorText === selector && cssRule.style[rule]) {
          sheet.deleteRule(index)
        }
      })
    },
    [sheet],
  )

  return { insertRule, updateRule, deleteRule }
}

export default useStylesheets
