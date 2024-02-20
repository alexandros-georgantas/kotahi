import { mapEntries, onEntries } from '../utils'

const useStylesheet = styleNode => {
  const insertRule = ctx => {
    const { selector, rules } = ctx
    if (!rules || !selector) return

    const selectorOnRules = [...styleNode.current.sheet.cssRules].find(
      cssRule => cssRule.selectorText === selector,
    )

    const ruleString = `${selector} {
${mapEntries(rules, (rule, value) =>
  rule.length ? `\t${rule}: ${value};\n` : '',
).join('')}}
`

    // console.log(
    //   selectorOnRules
    //     ? `rule updated:\n${ruleString}`
    //     : `rule inserted:\n${ruleString}`,
    // )

    try {
      !selectorOnRules
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
      onEntries(rules, (rule, value) => {
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

  const makeCss = () =>
    mapEntries(styleNode.current.sheet.rules, (k, v) => v.cssText).join('')

  return { insertRule, updateRule, deleteRule, makeCss }
}

export default useStylesheet
