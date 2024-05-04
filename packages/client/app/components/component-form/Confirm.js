import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { sanitize } from 'isomorphic-dompurify'
import { unescape } from 'lodash'
import { th } from '@pubsweet/ui-toolkit'
import { useTranslation } from 'react-i18next'
import { Heading1 } from '../component-submit/src/style'
import { Action, ActionButton } from '../shared'

const Wrapper = styled.div`
  background: ${th('colorBackground')};
  color: ${th('colorText')};
  line-height: ${th('lineHeightBase')};
  max-height: 100%;
  max-width: 60em;
  overflow-y: auto;
  padding: calc(${th('gridUnit')} * 6);
`

const Paragraph = styled.p`
  font-size: ${th('fontSizeBase')};
  margin-bottom: calc(${th('gridUnit')} * 3);
  width: 100%;
`

const Divider = styled.span`
  margin: 0 ${th('gridUnit')};
`

const createMarkup = encodedHtml => ({
  __html: sanitize(unescape(encodedHtml)),
})

const Confirm = ({ toggleConfirming, form, submit, errors }) => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <article>
        <Heading1 dangerouslySetInnerHTML={createMarkup(form.popuptitle)} />
        <Paragraph
          dangerouslySetInnerHTML={createMarkup(form.popupdescription)}
        />
        <ActionButton
          data-testid="confirm-submit"
          onClick={submit}
          primary
          type="submit"
        >
          {t('manuscriptSubmit.Submit')}
        </ActionButton>
        <Divider> {t('manuscriptSubmit.or')} </Divider>
        <Action onClick={toggleConfirming}>
          {t('manuscriptSubmit.get back to your submission')}
        </Action>
      </article>
    </Wrapper>
  )
}

Confirm.propTypes = {
  toggleConfirming: PropTypes.func.isRequired,
  form: PropTypes.shape({
    popuptitle: PropTypes.string.isRequired,
    popupdescription: PropTypes.string.isRequired,
  }).isRequired,
  submit: PropTypes.func.isRequired,
}

export default Confirm
