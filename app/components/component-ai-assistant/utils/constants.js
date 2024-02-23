import { mapEntries, values } from './utils'

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
export const previewOnlyCSS = /* css */ `
@page {
  @bottom-center {
    content: counter(page);
    font-size: var(--page-counter-font-size);
    text-align: center;
    color: var(--page-counter-color);
  }
}
/* CSS for Paged.js interface – v0.4 */

/* Change the look */
:root {
    --color-background: whitesmoke;
    --color-pageSheet: #cfcfcf;
    --color-pageBox: violet;
    --color-paper: white;
    --color-marginBox: transparent;
    --pagedjs-crop-color: black;
    --pagedjs-crop-shadow: white;
    --pagedjs-crop-stroke: 1px;
}

/* To define how the book look on the screen: */
@media screen, pagedjs-ignore {
    body {
        background-color: var(--color-background);
    }

    .pagedjs_pages {
        display: flex;
        width: calc(var(--pagedjs-width) * 2);
        flex: 0;
        flex-wrap: wrap;
        margin: 0 auto;
    }

    .pagedjs_page {
        background-color: var(--color-paper);
        box-shadow: 0 0 0 1px var(--color-pageSheet);
        margin: 0;
        flex-shrink: 0;
        flex-grow: 0;
        margin-top: 10mm;
    }

    .pagedjs_first_page {
        margin-left: var(--pagedjs-width);
    }

    .pagedjs_page:last-of-type {
        margin-bottom: 10mm;
    }

    .pagedjs_pagebox{
        box-shadow: 0 0 0 1px var(--color-pageBox);
    }

    .pagedjs_left_page{
        z-index: 20;
        width: calc(var(--pagedjs-bleed-left) + var(--pagedjs-pagebox-width))!important;
    }

    .pagedjs_left_page .pagedjs_bleed-right .pagedjs_marks-crop {
        border-color: transparent;
    }
    
    .pagedjs_left_page .pagedjs_bleed-right .pagedjs_marks-middle{
        width: 0;
    } 

    .pagedjs_right_page{
        z-index: 10;
        position: relative;
        left: calc(var(--pagedjs-bleed-left)*-1);
    }

    /* show the margin-box */

    .pagedjs_margin-top-left-corner-holder,
    .pagedjs_margin-top,
    .pagedjs_margin-top-left,
    .pagedjs_margin-top-center,
    .pagedjs_margin-top-right,
    .pagedjs_margin-top-right-corner-holder,
    .pagedjs_margin-bottom-left-corner-holder,
    .pagedjs_margin-bottom,
    .pagedjs_margin-bottom-left,
    .pagedjs_margin-bottom-center,
    .pagedjs_margin-bottom-right,
    .pagedjs_margin-bottom-right-corner-holder,
    .pagedjs_margin-right,
    .pagedjs_margin-right-top,
    .pagedjs_margin-right-middle,
    .pagedjs_margin-right-bottom,
    .pagedjs_margin-left,
    .pagedjs_margin-left-top,
    .pagedjs_margin-left-middle,
    .pagedjs_margin-left-bottom {
        box-shadow: 0 0 0 1px inset var(--color-marginBox);
    }


    .pagedjs_pages {
        flex-direction: column;
        width: 100%;
    }

    .pagedjs_first_page {
        margin-left: 0;
    }

    .pagedjs_page {
        margin: 0 auto;
        margin-top: 10mm;
    } 

    .pagedjs_left_page{
        width: calc(var(--pagedjs-bleed-left) + var(--pagedjs-pagebox-width) + var(--pagedjs-bleed-left))!important;
    }

    .pagedjs_left_page .pagedjs_bleed-right .pagedjs_marks-crop{
        border-color: var(--pagedjs-crop-color);
    }

    .pagedjs_left_page .pagedjs_bleed-right .pagedjs_marks-middle{
        width: var(--pagedjs-cross-size)!important;
    } 

    .pagedjs_right_page{
        left: 0; 
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
  @page {
      size: A4;
      margin:  20mm;
    }

    @page :first {
      margin:  3cm;
    }

    @page :left {
      margin-left:  3cm;
      margin-right:  15mm;
    }

    @page :right {
      margin-left:  15mm;
      margin-right:  3cm;
    }



`

// export const systemGuidelinesV1 = (ctx, sheet) => `

// You are a CSS, JS and HTML expert, your task is to interpret which changes the 'user' wants to do on a css property from an html tag.

// You must retain the contex of the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.

// Keep in mind that 'user' might not know css, so the prompt must be analysed carefully in order to complete the task.

// [validSelector] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${getSelectorsRecursively(
//   ctx,
//   sheet,
// ).join(', ')}].${sheet ? ` This style sheet is the context:${sheet}` : ''}

// Sometimes you will need to aplly pagedjs css, here is the documentation url: 'https://pagedjs.org'.

//  If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "${
//    ctx.selector
//  }" as default value. This variable represents the HTML element whose CSS properties need to be changed.

// ["validSelector"] also can be followed by ::nth-of-type(n) or nth-child(n) pseudoselectors, but ONLY if user specifies a number for the element,

// Provide a CSS rule and its value in the following JSON format: {"[validSelector]": {"cssRule": "validCSSValue"}, ...moreRulesIfMoreHtmlElementsAreInvolved}.

// Use hex for colors and px units for sizes. 'user' can request to mix colors: for example if the color is #000000 and 'user' asks for a litle more of blue you have to do: '#000055'

// You cannot use individual properties, like ('background-image', 'background-color', 'border-color', ...etc); use shorthand properties instead.

// You can refer to this rules as context for user's request if needed: ${String(
//   ctx.rules,
// )}

// The output must always be a valid JSON. Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

// If 'user' request to know for the value of a property on the css sheet context, respond in natural(non-technical) language, for example: The [property] of the [requested element by user] is [value]

// You must never say to user what to code, you must return the valid JSON or, in other case, ask user again to improve his prompt in order to help you to style his article.

// IMPORTANT: If you have the css solution for 'user' request return the JSON output only, not a suggestion

// If the prompt can't be resolved through CSS or doesn't involve CSS, respond: 'My purpose is to assist you with your article's design. Please, tell me how can i help you to improve your designs'.

// `

// const getSelectorsRecursively = ctx => {
//   const finalOutput = [ctx.selector]

//   ctx.childs.forEach(
//     child =>
//       child?.selector &&
//       !finalOutput.includes(child.selector) &&
//       finalOutput.push(child.selector),
//   )

//   return finalOutput
// }

const PAGEDJS_GUIDELINES = {
  NamedString: `
The fastest way to create running headers/footers is to use what is already in your content. Named strings are used to create running headers and footers: they copy text for reuse in margin boxes.

First, the text content of the selected element is cloned into a named string using string-set with a custom identifier (in the code below we call it “title”, but you can name it whatever makes sense as a variable). In the following example, each time a new <h2> appears in the HTML, the content of the named string gets updated with the text of that <h2>. (It also can be selected with a class if you prefer).

h2 {
  string-set: title content(text);
}

Next, the string() function copies the value of a named string to the margin boxes, via the content property:

@page {
  @bottom-center {
    content: string(title);
  }
}
The string property act like a variable. It read your DOM and each time a new title level 2 is encountered, it change the variable from the page where that title appears. This variable is passed into the margin boxes of the page and into all the following margin boxes until there is a new title.
`,
}

const TASK_AND_ROLE_DEFINITIONS = `You are a CSS, JS and HTML expert with a vast knowledge on pagedjs library ('https://pagedjs.org').

Your task is to assist 'user' with the design of an article.

'user' will tell you in natural language the changes he wants to make on the article's design

You must interpret and translate the 'user' request, into css properties/values and html tags or selectors.

Keep in mind that 'user' don't know how to code, so the prompt must be analysed carefully in order to complete the task.

IMPORTANT: 
- You must never say to user what to code, and never give him instructions.

- Your response must be ALWAYS the valid JSON (described below), NEVER text.

The article is designed with pagedjs, so you will need to apply pagedjs css in some cases.

Here you have some pagedJs guidleines: ${values(PAGEDJS_GUIDELINES).join('\n')}
`

const CONTEXT = (sheet, rules) => `${
  sheet ? `This style sheet is the css context:\n${sheet}\n` : ''
}${
  rules !== null
    ? `\nYou can refer to this rules as context for user's request if needed: ${mapEntries(
        rules,
        (rule, value) => `${rule} : ${value};`,
      ).join('\n')}`
    : ''
}
You must retain also in context the properties 'user' pointed on previous prompts, to add, remove, or modify it/them accordingly.
`

const SELECTOR_SHAPE = ({
  selector,
  selectors,
  tagName,
}) => `[validSelector] is a placeholder variable (see below), and its value can only be one of the following valid selectors: [${selectors}].

 If the prompt refers to an HTML element and it's tagname matches one of these valid selectors use it, otherwise use "${
   selector || tagName
 }" as default value. This variable represents the HTML element whose CSS properties need to be changed.

["validSelector"] also can be followed by nth-of-type(n) or nth-child(n) or any other pseudo-selectors, but ONLY if 'user' specifies a number for the element,
`

const CSS_FORMAT = `A valid CSS string containing the rules and its values in the following format: 
[validSelector] {
  cssRule: validCSSValue;
  ...it can have nested rules within
}
...moreRulesIfMoreHtmlElementsAreInvolved
`

const CSS_LIMITS = `Use hex for colors. 'user' can request to mix colors: for example if the color is #000000 and 'user' asks for a litle more of blue you have to mix the hex values acordingly

You cannot use individual properties, like ('background-image', 'background-color', 'border-color', ...etc); use shorthand properties instead.`

const JSON_FORMAT = `The output must be always in the following JSON format: {
  "rules": {"validCSSProperty": "validCSSValue", ...moreValidCssPropertiesAndValues},
},
"css": "${CSS_FORMAT}",
"feedback": you must provide here a string with the feedback: 
this string can contain:

- In case the user request can be fullfiled: The changes that where applied.

- If 'user' ask for the value of a property on the css sheet context, respond in natural(non-technical) language, for example: The [property] of the [requested element by user] is [value].

- If user request information about valid css or pagedjs properties or values is expected a list of avaiable values or properties as output.

- If none of the above, Ask user again to improve his prompt in order to help you to style his article. 
}
`

const IMPORTANT_NOTES = `
IMPORTANT: 

- The output must always be the expected valid JSON. 

- Ensure that each key is a string enclosed in double quotes and that each value is a valid CSS value, also enclosed in double quotes.

- If 'user' requests to change the styles to make the article look "like" or "similar" to a given reference:
     - Your scope must be pagedjs, starting from the @page rule. 
     - You must modify all necessary styles, including pagedjs rules.
     - It needs to be as detailed as possible, change colors, fonts, margins, padding, footers and any other pagedjs and css styles to achieve the most similar appearence.

- The Response must be ALWAYS the expected valid JSON, never text, if you have something to say it must be on the feedback from the JSON object.
`

export const systemGuidelinesV2 = (ctx, sheet, selectors) => `

${TASK_AND_ROLE_DEFINITIONS}

${CONTEXT(sheet, ctx.rules)}

${CSS_LIMITS}

${SELECTOR_SHAPE({ ...ctx, selectors })}

${JSON_FORMAT}

${IMPORTANT_NOTES}
`
