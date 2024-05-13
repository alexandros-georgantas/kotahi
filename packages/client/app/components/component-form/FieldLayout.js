import React from 'react'
import styled from 'styled-components'
import theme, { color } from '../../theme'

const Section = styled.section`
  display: flex;
  flex-direction: ${({ cssOverrides }) =>
    cssOverrides && cssOverrides['flex-direction']
      ? cssOverrides['flex-direction']
      : 'column'};
  flex-wrap: ${({ cssOverrides }) =>
    cssOverrides && cssOverrides.wrap ? cssOverrides.wrap : 'nowrap'};
  justify-content: space-between;
  margin: 24px 0;
`

const FieldHead = styled.div`
  align-items: baseline;
  display: flex;
  width: auto;

  & > div:first-of-type {
    font-size: ${theme.fontSizeBase};
    font-weight: 500;
    margin-bottom: ${theme.spacing.e};
  }

  & > label {
    /* this is to make "publish" on decision page go flush right */
    margin-left: auto;
  }
`

const MessageWrapper = styled.div`
  color: ${color.error.base};
  display: flex;
  font-family: ${theme.fontInterface};
  font-size: ${theme.fontSizeBaseSmall};
  line-height: ${theme.lineHeightBaseSmall};
  margin-left: 12px;
  margin-top: -${theme.spacing.b};
`

const SubNote = styled.span`
  color: ${color.gray40};
  font-size: ${theme.fontSizeBaseSmall};
  font-style: italic;
  line-height: ${theme.lineHeightBaseSmall};
  width: 100%;

  & h1 {
    font-size: 1.75em;
    font-weight: 500;
    margin: 1em 0;
  }

  & h2 {
    font-size: 1.625em;
    font-weight: 500;
    margin: 1em 0;
  }

  & h3 {
    font-size: 1.5em;
    font-weight: 500;
    margin: 1em 0;
  }

  & h4 {
    font-size: 1.375em;
    font-weight: 500;
    margin: 1em 0;
  }

  & h5 {
    font-size: 1.25em;
    font-weight: 500;
    margin: 1em 0;
  }

  & h6 {
    font-size: 1.125em;
    font-weight: 500;
    margin: 1em 0;
  }

  & p {
    margin-bottom: 1em;
    margin-top: 6px;
  }

  & ul,
  & ol {
    list-style: outside;
    padding-left: 30px;

    & li p {
      margin: 0.2em 0;
    }

    & li:last-child p {
      margin-bottom: 0.5em;
    }
  }

  & u {
    text-decoration: underline;
  }

  & strong {
    font-weight: bold;
  }

  & em {
    font-style: italic;
  }

  & blockquote {
    border-left: 3px solid #eee;
    margin-left: 0;
    margin-right: 0;
    padding-left: 1em;
  }

  & sup,
  & sub {
    line-height: 0;
  }

  & .small-caps {
    font-variant: small-caps;
  }

  & a {
    color: blue;
  }
`

const FieldLayout = ({
  cssOverrides,
  errorMessage,
  field,
  label,
  publishingSelector,
  subNote,
}) => {
  return (
    <Section cssOverrides={cssOverrides}>
      <FieldHead>
        {label}
        {publishingSelector}
        <MessageWrapper>{errorMessage}</MessageWrapper>
      </FieldHead>
      {field}
      {subNote && <SubNote>{subNote}</SubNote>}
    </Section>
  )
}

export default FieldLayout
