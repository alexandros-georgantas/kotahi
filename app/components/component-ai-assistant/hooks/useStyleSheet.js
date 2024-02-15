import { mapEntries, onEntries } from '../utils/helpers'

const useStylesheet = styleNode => {
  const insertRule = ctx => {
    const { selector, rules } = ctx
    if (!rules) return

    const selectorsInRules = [...styleNode.current.sheet.cssRules].map(
      cssRule => cssRule.selectorText,
    )

    const ruleString = `${selector} {\n${mapEntries(rules, (rule, value) => {
      return `\t${rule}: ${value}`
    }).join(';\n')}}`

    try {
      !selectorsInRules.includes(selector)
        ? styleNode.current.sheet.insertRule(
            ruleString,
            styleNode.current.sheet.cssRules.length,
          )
        : updateRule(ctx)
    } catch (error) {
      console.error('Error inserting rule: ', error)
    }
  }

  const updateRule = ctx => {
    const { selector, rules } = ctx
    const cssRules = [...styleNode.current.sheet.cssRules]

    cssRules.forEach(cssRule => {
      // console.log(rules)
      onEntries(rules, (rule, value) => {
        // console.log(`${rule}:${value}`)

        if (
          cssRule.selectorText === selector &&
          cssRule.style[rule] !== value
        ) {
          // eslint-disable-next-line no-param-reassign
          cssRule.style[rule] = value
        }
      })
    })
  }

  const deleteRule = (selector, rule) => {
    ;[...styleNode.current.sheet.cssRules].forEach((cssRule, index) => {
      if (cssRule.selectorText === selector && cssRule.style[rule]) {
        styleNode.current.sheet.deleteRule(index)
      }
    })
  }

  const getCss = () =>
    mapEntries(styleNode.current.sheet.rules, (k, v) => v.cssText).join('')

  return { insertRule, updateRule, deleteRule, getCss }
}

export default useStylesheet
