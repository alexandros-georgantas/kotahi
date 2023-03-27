export const DataList = {
    "SpaceBeforeOpenSquare": {
        "search": RegExp(/\s+\[/giu),
        "replace": `[`,
        "expression": true,
        "replacePosition": "before",
        "replaceType": "replace"
    },
    "SpaceAfterOpenSquare": {
        "search": RegExp(/\[\s+/giu),
        "replace": `[`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "MultiSpace": {
        "search": RegExp(/\s\s+/giu),
        "replace": `${String.fromCharCode(32)}`,
        "expression": true,
        "replacePosition": "before",
        "replaceType": "replace"
    },
    "RemoveHyperlink": {
        "type": 'link',
        "replaceType": "remove"
    },
    "SpaceAfterCloseCurly": {
        "search": RegExp(/\}\s+/giu),
        "replace": `}`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "FindImage": {
        "type": 'figure',
        "replaceType": "remove",
    },
    "SpaceAfterCloseParenthesis": {
        "search": RegExp(/\)\s+/giu),
        "replace": `)`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "SpaceAfterCloseSquare": {
        "search": RegExp(/\]\s+/giu),
        "replace": `]`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "SpaceAfterOpenCurly": {
        "search": RegExp(/\{\s+/giu),
        "replace": `{`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "SpaceAfterOpenParenthesis": {
        "search": RegExp(/\(\s+/giu),
        "replace": `(`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "SpaceAfterSingleQuotation": {
        "search": RegExp(/'\s+/gm),
        "replace": `'`,
        "expression": true,
        "replacePosition": "after",
        "replaceType": "remove",
    },
    "SpaceAfterDoubleQuotation": {
        search: RegExp(/"\s+/gm),
        replace: `"`,
        expression: true,
        replacePosition: "after",
        "replaceType": "remove",
    },
    "SpaceBeforeCloseCurly": {
        search: RegExp(/\s+\}/giu),
        replace: `}`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeCloseParanthesis": {
        search: RegExp(/\s+\)/giu),
        replace: `)`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeCloseSquare": {
        search: RegExp(/\s+\]/giu),
        replace: `]`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeColon": {
        search: RegExp(/\s+:/giu),
        replace: `:`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeOpenCurly": {
        search: RegExp(/\s+\{/giu),
        replace: `{`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeOpenParenthesis": {
        search: RegExp(/\s+\(/giu),
        replace: `(`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforePeriod": {
        search: RegExp(/\s+\./gm),
        replace: `.`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeSingleQuotation": {
        search: RegExp(/\s+'/gm),
        replace: `'`,
        replacePosition: "before",
        expression: true,
        "replaceType": "remove",
    },
    "SpaceBeforeDoubleQuotation": {
        search: RegExp(/\s+"/gm),
        replace: `"`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "UnderlineText": {
        type: 'underline',
        "replaceType": "remove",
    },
    "Repeatword": {
        type: 'repeated-word',
        "replaceType": "remove",
    },
    "Apostraphe": {
        search: `'`,
        replace: `${String.fromCharCode(8217)}`,
        expression: false,
        type: 'apostraphe',
        "replaceType": "replace",
    },
    "Charcode176": {
        search: `176`,
        replace: `${String.fromCharCode(176)}`,
        expression: false,
        "replaceType": "replace",
    },
    "CloseDoubleQuotes": {
        search: `"`,
        replace: `${String.fromCharCode(8221)}`,
        expression: false,
        "replaceType": "replace",
    },
    "CloseSingleQuotes": {
        search: `'`,
        replace: `${String.fromCharCode(8217)}`,
        expression: false,
        "replaceType": "replace",
    },
    "MultipleHardBreaks": {
        type: 'HardBreak',
        "replaceType": "replace",
    },
    "NonBreakingSpace": {
        search: ` `,
        replace: `${String.fromCharCode(32)}`,
        expression: false,
        "replaceType": "replace",
    },
    "OpenDoubleQuotes": {
        search: `"`,
        replace: `${String.fromCharCode(8220)}`,
        expression: false,
        "replaceType": "replace",
    },
    "OpenSingleQuotes": {
        search: `'`,
        replace: `${String.fromCharCode(8216)}`,
        expression: false,
        "replaceType": "replace",
    },
    "SoftBreak": {
        search: `invisible--break`,
        replace: ``,
        expression: false,
        "replaceType": "replace",
    },
    "SpaceAfterClosedupComma": {
        search: RegExp(/\,(?!\s)/gm),
        replace: `, `,
        expression: true,
        "replaceType": "replace",
    },
    "SpaceAfterPeriod": {
        search: RegExp(/\.(?!\s)/gm),
        replace: `. `,
        expression: true,
        "replaceType": "replace",
    },
    "SpaceAfterSemicolon": {
        search: RegExp(/\;(?!\s)/gm),
        replace: `; `,
        expression: true,
        "replaceType": "replace",
    },
    "SuperscriptO": {
        search: `o`,
        replace: `${String.fromCharCode(176)}`,
        expression: false,
        tag: 'sup',
        "replaceType": "replace",
    },
    "SuperscriptZero": {
        search: `0`,
        replace: `${String.fromCharCode(176)}`,
        expression: false,
        tag: 'sup',
        "replaceType": "replace",
    },
    "ThinSpace": {
        search: RegExp(/  +/gm),
        replace: `${String.fromCharCode(32)}`,
        expression: true,
        replacePosition: "after",
        "replaceType": "replace",
    },
    "Ellipsis": {
        search: `. . .`,
        replace: `${String.fromCharCode(8230)}`,
        expression: false,
        "replaceType": "replace",
    },
    "SpaceBeforeApostrophe": {
        search: RegExp(/\s+\'/gm),
        replace: `'`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeComma": {
        search: RegExp(/\s+\,/gm),
        replace: `,`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeExclamatory": {
        search: RegExp(/\s+\!/gm),
        replace: `!`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeQuestionMark": {
        search: RegExp(/\s+\?/gm),
        replace: `?`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceBeforeSemicolon": {
        search: RegExp(/\s+\;/gm),
        replace: `;`,
        expression: true,
        replacePosition: "before",
        "replaceType": "remove",
    },
    "SpaceAfterEmdash": {
        search: RegExp(/\—(?!\s)/gm),
        replace: `— `,
        expression: true,
        replacePosition: "after",
        "replaceType": "replace",
        
    },
    "SpaceBeforeEmdash": {
        search: RegExp(/[^\s]—/gm),
        replace: ` —`,
        expression: true,
        replacePosition: "before",
        "replaceType": "replace",
        type: "emdash"
    },
}
