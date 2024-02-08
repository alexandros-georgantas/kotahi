const useStylesheets = () => {
  const insertRule = (styleNode, ctx) => {
    const { selector, rules } = ctx

    const ruleString = `${selector} {\n${rules
      .map(({ rule, value }) => {
        return `\t${rule}: ${value}`
      })
      .join(';\n')}\n}`

    try {
      styleNode.sheet.insertRule(ruleString, styleNode.sheet.cssRules.length)
    } catch (error) {
      console.error('Error inserting rule: ', error)
    }
  }

  const updateRule = (sheet, { selector, rules }) => {
    ;[...sheet.sheet.cssRules].forEach(cssRule => {
      rules.forEach(({ rule, value }) => {
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

  const deleteRule = (sheet, selector, rule) => {
    ;[...sheet.sheet.cssRules].forEach((cssRule, index) => {
      if (cssRule.selectorText === selector && cssRule.style[rule]) {
        sheet.sheet.deleteRule(index)
      }
    })
  }

  return { insertRule, updateRule, deleteRule }
}

export default useStylesheets
