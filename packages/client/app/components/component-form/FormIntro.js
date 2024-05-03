import React, { useContext } from 'react'
import styled from 'styled-components'
import { unescape } from 'lodash'
import { sanitize } from 'isomorphic-dompurify'
import theme from '../../theme'
import { ConfigContext } from '../config/src'

const link = (urlFrag, manuscriptId) =>
  String.raw`<a href=${urlFrag}/versions/${manuscriptId}/manuscript>view here</a>`

const createMarkup = encodedHtml => ({
  __html: sanitize(unescape(encodedHtml)),
})

const Heading = styled.h1`
  font-size: ${theme.fontSizeHeading3};
  font-weight: 700;
  line-height: ${theme.lineHeightHeading3};
  margin: ${theme.spacing.e} 0 ${theme.spacing.e};
  padding: 0;
`

const Blurb = styled.div`
  line-height: 1.4;
  margin-bottom: ${theme.spacing.g};

  p {
    margin: 0;
  }
`

const FormIntro = ({ form, manuscriptId }) => {
  const config = useContext(ConfigContext)
  const { urlFrag } = config

  return (
    <header>
      <Heading>{form.name}</Heading>
      <Blurb
        dangerouslySetInnerHTML={createMarkup(
          (form.description || '').replace(
            '###link###',
            link(urlFrag, manuscriptId),
          ),
        )}
      />
    </header>
  )
}

export default FormIntro
