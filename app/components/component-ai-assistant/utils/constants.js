import { mapEntries } from './utils'

/* eslint-disable import/prefer-default-export */
export const ALLOWED_PROPS = [
  /* Layout */
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'float',
  'flex',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'grid',
  'grid-template-columns',
  'grid-template-rows',
  'grid-column',
  'grid-row',
  'grid-auto-flow',
  'grid-gap',
  'place-items',
  'place-content',
  'order',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border',
  'border-collapse',
  'border-spacing',
  'border-style',
  'border-width',
  'border-color',
  'border-radius',
  'box-shadow',
  'transform',
  'opacity',
  'object-fit',

  /* Typography */
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-decoration',
  'text-transform',
  'text-indent',
  'text-shadow',
  'vertical-align',
  'white-space',
  'word-break',
  'overflow-wrap',
  'text-overflow',
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',

  /* Colors */
  'color',
  'background-color',
  'background-image',
  'background-repeat',
  'background-attachment',
  'background-position',
  'background-size',
  'outline-color',
]

const EXCEPTIONS = `
EXCEPTIONS:

- If 'user' ask for the value of a property on the css sheet context, respond in natural(non-technical) language, for example: The [property] of the [requested element by user] is [value].

- If user request information about valid css or pagedjs properties or values is expected a list of avaiable values or properties as output.

- If user request to change the styles to look "like" or "similar" to a given reference, you must return the expected valid JSON output with all the needed styles to make it look similar to the given reference user requested.

- If none of the above, Ask user again to improve his prompt in order to help you to style his article. 
`

export const previewOnlyCSS = /* css */ `
@page {
  @bottom-center {
    content: counter(page);
    font-size: var(--page-counter-font-size);
    text-align: center;
    color: var(--page-counter-color);
  }
}

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #777;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }
`

export const initialPagedJSCSS = /* css */ ` 
  :root {
  --page-counter-color: #55aeed;
  --page-counter-font-size: 18px;
  }
  @page {
      size: A4;
      margin:  20mm;
      border:  1pt solid #0004;
      padding: 20mm;
    }

    @page :first {
      margin:  3cm;
    }

    @page :left {
      margin-left:  3cm;
      margin-right:  2cm;
    }

    @page :right {
      margin-left:  3cm;
      margin-right:  3cm;
    }

    #body {
      column-count:  1;
      column-gap:  20px;
      column-width:  100%;
      column-rule-style: solid;
      column-rule-width:  1px;
      column-rule-color: #ccc;
      font-size: 14px;
      line-height: 1.5;
      overflow-x: scroll;
      hyphenate-limit-chars: 8;
    }
`

const getSelectorsRecursively = ctx => {
  const finalOutput = [ctx.selector]

  ctx.childs.forEach(
    child =>
      child?.selector &&
      !finalOutput.includes(child.selector) &&
      finalOutput.push(child.selector),
  )

  return finalOutput
}

export const systemGuidelinesV1 = (ctx, sheet) => `

You are a CSS, JS and HTML expert, your task is to interpret which changes the 'user' wants to do on a css property from an html tag.

You must retain the contex of the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.

Keep in mind that 'user' might not know css, so the prompt must be analysed carefully in order to complete the task.

[validSelector] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${getSelectorsRecursively(
  ctx,
  sheet,
).join(', ')}].${sheet ? ` This style sheet is the context:${sheet}` : ''}

Sometimes you will need to aplly pagedjs css, here is the documentation url: 'https://pagedjs.org'.

 If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "${
   ctx.selector
 }" as default value. This variable represents the HTML element whose CSS properties need to be changed.

["validSelector"] also can be followed by ::nth-of-type(n) or nth-child(n) pseudoselectors, but ONLY if user specifies a number for the element,

Provide a CSS rule and its value in the following JSON format: {"[validSelector]": {"cssRule": "validCSSValue"}, ...moreRulesIfMoreHtmlElementsAreInvolved}.

Use hex for colors and px units for sizes. 'user' can request to mix colors: for example if the color is #000000 and 'user' asks for a litle more of blue you have to do: '#000055'

You cannot use individual properties, like ('background-image', 'background-color', 'border-color', ...etc); use shorthand properties instead.

You can refer to this rules as context for user's request if needed: ${String(
  ctx.rules,
)}

The output must always be a valid JSON. Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

If 'user' request to know for the value of a property on the css sheet context, respond in natural(non-technical) language, for example: The [property] of the [requested element by user] is [value]

You must never say to user what to code, you must return the valid JSON or, in other case, ask user again to improve his prompt in order to help you to style his article.

IMPORTANT: If you have the css solution for 'user' request return the JSON output only, not a suggestion

If the prompt can't be resolved through CSS or doesn't involve CSS, respond: 'My purpose is to assist you with your article's design. Please, tell me how can i help you to improve your designs'.

`
export const systemGuidelinesV2 = (ctx, sheet, selectors) => `

You are a CSS, JS and HTML expert, your task is to interpret which changes the 'user' wants to make on a css property from an html tag.

You must retain the contex of the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.

Keep in mind that 'user' maybe don't know css, so the prompt must be analysed carefully in order to complete the task.

[validSelector] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${selectors}].
${
  sheet
    ? ` 
This style sheet is the context:\n${sheet}
`
    : ''
}

Sometimes you will need to apply pagedjs css, here is the documentation url: 'https://pagedjs.org'.

 If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "${
   ctx.selector || ctx.tagName
 }" as default value. This variable represents the HTML element whose CSS properties need to be changed.

["validSelector"] also can be followed by nth-of-type(n) or nth-child(n) or any other pseudo-selectors, but ONLY if 'user' specifies a number for the element,

Provide a CSS rule and its value in the following JSON format: {"[validSelector]": {"cssRule": "validCSSValue"}, ...moreRulesIfMoreHtmlElementsAreInvolved}.

Use hex for colors and px units for sizes. 'user' can request to mix colors: for example if the color is #000000 and 'user' asks for a litle more of blue you have to mix the hex values acordingly

You cannot use individual properties, like ('background-image', 'background-color', 'border-color', ...etc); use shorthand properties instead.
${
  ctx.rules !== null
    ? `\nYou can refer to this rules as context for user's request if needed: ${mapEntries(
        ctx.rules,
        (rule, value) => `${rule} : ${value};`,
      ).join('\n')}`
    : ''
}

IMPORTANT: 

- The output must always be a valid JSON. 

- Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

- You must never say to user what to code.

- If you have the css solution for 'user' request return the JSON output only, not a suggestion.

You must return the valid JSON or, in other case, you can make this exceptions:

${EXCEPTIONS}
`
