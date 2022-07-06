const fs = require('fs')
const path = require('path')
const sampleReferenceArray = require('./data/sampleReferences.json')

const rawData = fs.readFileSync(
  path.resolve(__dirname, 'data/sampleReferences.txt'),
  'utf8',
)

// Assuming that you have anystyle-cli running locally, sample data can be generated by running anystyle-cli locally:
//
//   anystyle parse server/anystyle/data/sampleReferences.txt server/anystyle/data
//
// which will export JSON to server/anystyle/data
//
// If using a different filename, change the filenames in this file for sampleReferenceArray and rawData.

// # JATS tags and JATS-flavored HTML equivalents:
//
// <ref-list> —> <section class="reflist">
// <ref id="ref-###"><mixed-citation> --> <p class="mixedcitation" id="ref=###">
// <person-group person-group-type="author"> --> <span class="authorgroup">
// <name> --> <span class="authorname">
// <surname> --> <span class="surname">
// <given-names> --> <span class="givennames">
// <suffix> --> <span class="suffix">
// <etal> --> <span class="etal" />
// <string-name> --> <span class="stringname"> (it would be nice if we didn't have to use this!)

const arrayOfRawData = rawData.split('\n').filter(x => x.length)

const makeStringSafeId = str =>
  encodeURIComponent(str)
    .toLowerCase()
    .replace(/\.|%[0-9a-z]{2}/gi, '')

const anyStyleToHtml = referenceArray => {
  let outText = '<section class="reflist">'

  for (let i = 0; i < referenceArray.length; i += 1) {
    const thisRef = referenceArray[i]
    console.log(
      `\n# Citation ${i}:\n`,
      'Original reference: `',
      arrayOfRawData[i],
      '`',
    )
    console.log('\n```json\n', thisRef, '\n```\n')

    let thisOut = ''

    // 1. deal with citation numbers
    // Query: why does citation-number come in as an array?
    // If we don't have a citation number, we're just sending this back as the index. This is not necessarily unique.
    console.log(
      `Citation number found for citation ${i}: ${JSON.stringify(
        thisRef['citation-number'],
      )}`,
    )

    const citationNumber =
      thisRef['citation-number'] && thisRef['citation-number'].length
        ? makeStringSafeId(thisRef['citation-number'][0])
        : i + 1

    delete thisRef['citation-number']
    thisOut += `<p class="mixedcitaion" id="ref-${citationNumber}">`

    if (thisRef.author) {
      let thisAuthorGroup = `<span class="authorgroup">`

      for (let j = 0; j < thisRef.author.length; j += 1) {
        const thisAuthor = thisRef.author[j]
        let thisAuthorText = `<span class="author">`

        if (thisAuthor.family) {
          thisAuthorText += `<span class="surname">${thisAuthor.family}</span>`
          delete thisAuthor.family
        }

        if (thisAuthor.given) {
          thisAuthorText += `<span class="givennames">${thisAuthor.given}</span>`
          delete thisAuthor.given
        }

        if (thisAuthor.suffix) {
          thisAuthorText += `<span class="suffix">${thisAuthor.suffix}</span>`
          delete thisAuthor.suffix
        }

        thisAuthorText += `</span>`

        if (thisAuthor.others) {
          thisAuthorText = `<span class="etal" />`
          delete thisAuthor.others
        }

        if (thisAuthor.literal) {
          console.log(
            `String-name being used for unstructured author name: ${JSON.stringify(
              thisAuthor,
            )}`,
          )
          thisAuthorText = `<span class="stringname">${thisAuthor.literal}</span>`
          delete thisAuthor.literal
        }

        thisAuthorGroup += thisAuthorText

        if (thisAuthorGroup)
          if (JSON.stringify(thisAuthor).length > 2) {
            console.log(`\nAuthor data: ${JSON.stringify(thisRef.author)}`)
            console.log(`Author ${j} remainder: ${JSON.stringify(thisAuthor)}`)
          }
      }

      thisAuthorGroup += `</span>`
      thisOut += thisAuthorGroup
      delete thisRef.author
    }

    console.log(
      `\n## Remainder for citation ${i}:`,
      '\n```json\n',
      thisRef,
      '\n```\n',
    )

    thisOut += JSON.stringify(thisRef)
    thisOut += `</p>`

    console.log(`\n## Output ${i}:`, '\n````html\n', thisOut, '\n````\n\n')

    outText += thisOut
  }

  outText += '</section>'
  return outText
}

// This is designed for testing anystyle's conversion. To run:
//
// node server/anystyle/anystyleToHtml.js > server/anystyle/output/output.md

anyStyleToHtml(sampleReferenceArray)

module.exports = anyStyleToHtml
