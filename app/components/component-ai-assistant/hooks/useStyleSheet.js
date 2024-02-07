const useStylesheets = () => {
  const insertRule = (sheet, ctx) => {
    const { selector, rules } = ctx

    const ruleString = `${selector} {\n${rules
      .map(({ rule, value }) => {
        return `\t${rule}: ${value}`
      })
      .join(';\n')}\n}`

    try {
      sheet.sheet.insertRule(ruleString, sheet.sheet.cssRules.length)
    } catch (error) {
      console.error('Error inserting rule: ', error)
    }
  }

  const updateRule = (sheet, { selector, rules: { rule, value } }) => {
    ;[...sheet.sheet.cssRules].forEach(cssRule => {
      if (cssRule.selectorText === selector && cssRule.style[rule]) {
        // eslint-disable-next-line no-param-reassign
        cssRule.style[rule] = value
      }
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
