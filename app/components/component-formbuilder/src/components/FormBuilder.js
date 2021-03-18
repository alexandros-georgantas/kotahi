import React from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { unescape } from 'lodash'
import { th, grid } from '@pubsweet/ui-toolkit'
import { Icon, Action } from '@pubsweet/ui'
import { Page, Heading } from './style'

const Element = styled.div`
  border: 1px solid ${th('colorBorder')};
  border-radius: ${th('borderRadius')};
  display: flex;
  justify-content: space-between;
  margin: ${grid(2)};
  padding: ${grid(2)} ${grid(1)};
`

const StatusIcon = withTheme(({ children, theme }) => (
  <Icon color={theme.colorPrimary}>{children}</Icon>
))

const Status = styled.div`
  align-items: center;
  color: ${th('colorPrimary')};
  display: inline-flex;
`

const StatusIdle = styled(Status).attrs(props => ({
  children: <StatusIcon>plus_circle</StatusIcon>,
}))``

const Root = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 200;
  padding-bottom: 10px;
  padding-top: 10px;

  &:hover ${StatusIdle} {
    circle {
      fill: ${th('colorPrimary')};
      stroke: ${th('colorPrimary')};
    }

    line {
      stroke: white;
    }
  }
`

const Main = styled.div`
  display: flex;
  justify-content: center;
`

const ElementTitle = styled.span``

const createMarkup = encodedHtml => ({
  __html: unescape(encodedHtml),
})

const BuilderElement = ({
  elements,
  setActiveFieldId,
  deleteFormElement,
  formId,
}) => {
  const orderedElements = [...elements].sort(
    (obj1, obj2) => parseInt(obj1.order, 10) - parseInt(obj2.order, 10),
  )

  return orderedElements.map(element => (
    <Element key={`element-${element.id}`}>
      <Action onClick={() => setActiveFieldId(element.id)}>
        <ElementTitle dangerouslySetInnerHTML={createMarkup(element.title)} /> (
        {element.component})
      </Action>
      <Action
        onClick={() => {
          deleteFormElement({
            variables: { formId, elementId: element.id },
          })
        }}
      >
        🗙
      </Action>
    </Element>
  ))
}

BuilderElement.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      component: PropTypes.string,
      order: PropTypes.string,
    }).isRequired,
  ).isRequired,
  setActiveFieldId: PropTypes.func.isRequired,
  deleteFormElement: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
}

const AddButtonElement = ({ addElement }) => (
  <Root>
    <Main>
      <Action
        onClick={() =>
          addElement({
            title: 'New Component',
            id: `${Date.now()}`,
          })
        }
      >
        <Heading>
          <StatusIdle />
          Add Element
        </Heading>
      </Action>
    </Main>
  </Root>
)

AddButtonElement.propTypes = {
  addElement: PropTypes.func.isRequired,
}

const FormBuilder = ({
  form,
  setActiveFieldId,
  addFormElement,
  deleteFormElement,
}) => {
  return (
    <Page>
      {form.children && form.children.length > 0 && (
        <BuilderElement
          deleteFormElement={deleteFormElement}
          elements={form.children}
          formId={form.id}
          setActiveFieldId={setActiveFieldId}
        />
      )}
      <AddButtonElement
        addElement={newElement => {
          addFormElement({
            variables: { element: JSON.stringify(newElement), formId: form.id },
          })
          setActiveFieldId(newElement.id)
        }}
      />
    </Page>
  )
}

FormBuilder.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        component: PropTypes.string,
        order: PropTypes.string,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  setActiveFieldId: PropTypes.func.isRequired,
  addFormElement: PropTypes.func.isRequired,
  deleteFormElement: PropTypes.func.isRequired,
}

export default FormBuilder
