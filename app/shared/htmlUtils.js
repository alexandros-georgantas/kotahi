import { unescape } from 'lodash'
import { sanitize } from 'isomorphic-dompurify'

// eslint-disable-next-line import/prefer-default-export
export const hasValue = val =>
  typeof val === 'string' &&
  val &&
  val !== '<p class="paragraph"></p>' &&
  val !== '<p></p>'

export const createSafeMarkup = encodedHtml => ({
  __html: sanitize(unescape(encodedHtml)),
})
