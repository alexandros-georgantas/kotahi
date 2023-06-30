import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled, { withTheme } from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import { Icon, Action } from '@pubsweet/ui'
import { Page } from './style'
import { DragVerticalIcon } from '../../../shared/Icons'
import lightenBy from '../../../../shared/lightenBy'
import { ConfirmationModal } from '../../../component-modal/src/ConfirmationModal'
import { fieldTypes, submissionFieldTypes } from './config/Elements'

const FeildWrapper = styled.div`
  align-items: center;
  border-radius: ${th('borderRadius')};
  display: flex;
  padding: ${grid(0.5)};

  &.active {
    background-color: ${lightenBy('colorPrimary', 0.7)};
  }

  &:hover svg {
    stroke: ${th('colorPrimary')};
  }
`

const Element = styled.div`
  background-color: ${th('colorSecondaryBackground')};
  border-radius: ${th('borderRadius')};
  display: flex;
  justify-content: space-between;
  width: 100%;

  &.active {
    background-color: ${lightenBy('colorPrimary', 0.7)};
  }
`

const MainAction = styled(Action)`
  flex-grow: 1;
  text-align: left;
`

const IconAction = styled(Action)`
  flex-grow: 0;
  margin: 0 ${grid(1)};
`

const DragIcon = styled(DragVerticalIcon)`
  height: 20px;
  margin-right: ${grid(1)};
  stroke: transparent;
  width: 20px;
`

const UnpaddedIcon = styled(Icon)`
  padding: 0;
  vertical-align: text-top;
`

const SmallIcon = withTheme(({ children, theme }) => (
  <UnpaddedIcon color="transparent" size={2.5}>
    {children}
  </UnpaddedIcon>
))

const FieldTypeLabel = styled.span`
  color: ${lightenBy('colorPrimary', 0.5)};
  font-size: ${th('fontSizeBaseSmall')};
  margin-left: 0.5em;
`

const BuilderElement = ({
  category,
  element,
  isSelected,
  setSelectedFieldId,
  deleteField,
  formId,
  formFeildId,
  index,
}) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [formFieldId, setFormFieldId] = useState()

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    margin: `0px 0px 8px`,
  })

  let componentTypeOptions =
    category === 'submission' ? submissionFieldTypes : fieldTypes

  // Disable ThreadedDiscussion in submission and review forms
  if (['submission', 'review'].includes(category))
    componentTypeOptions = componentTypeOptions.filter(
      o => o.value !== 'ThreadedDiscussion',
    )
  // Disable ManuscriptFile in review and decision forms
  if (['review', 'decision'].includes(category))
    componentTypeOptions = componentTypeOptions.filter(
      o => o.value !== 'ManuscriptFile',
    )

  const fieldType = componentTypeOptions.find(
    x => x.value === element.component,
  )

  return (
    <Draggable draggableId={formFeildId} index={index} key={formFeildId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
          )}
        >
          <FeildWrapper
            className={isSelected || snapshot.isDragging ? 'active' : undefined}
            id={formFeildId}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <DragIcon />
            <Element
              className={
                isSelected || snapshot.isDragging ? 'active' : undefined
              }
              key={`element-${element.id}`}
              onClick={() => setSelectedFieldId(element.id)}
            >
              <MainAction>
                {element.shortDescription ?? element.title}{' '}
                {fieldType.isCustom && (
                  <FieldTypeLabel>
                    (
                    {fieldTypes.find(x => x.value === element.component)?.label}
                    )
                  </FieldTypeLabel>
                )}
              </MainAction>
              <IconAction
                onClick={e => {
                  setDeleteModalIsOpen(true)
                  setFormFieldId(element.id)
                  e.stopPropagation()
                }}
              >
                <SmallIcon>x</SmallIcon>
              </IconAction>
            </Element>

            <ConfirmationModal
              closeModal={() => setDeleteModalIsOpen(false)}
              confirmationAction={() =>
                deleteField({ variables: { formId, elementId: formFieldId } })
              }
              confirmationButtonText="Delete"
              isOpen={deleteModalIsOpen}
              message="Permanently delete this field?"
            />
          </FeildWrapper>
        </div>
      )}
    </Draggable>
  )
}

BuilderElement.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    title: PropTypes.string.isRequired,
    component: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  setSelectedFieldId: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
}

const FormBuilder = ({
  selectedFieldId,
  form,
  category,
  setSelectedFieldId,
  addField,
  deleteField,
  dragField,
  moveFieldUp,
  moveFieldDown,
}) => {
  return (
    <Page style={{ display: 'flex', flexDirection: 'column', minHeight: '0' }}>
      <DragDropContext onDragEnd={dragField}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ overflowY: 'scroll', flex: '1 1 0%', minHeight: '0' }}
            >
              {form.structure.children?.map((element, index) => (
                <BuilderElement
                  category={category}
                  deleteField={deleteField}
                  element={element}
                  formFeildId={element.id}
                  formId={form.id}
                  index={index}
                  isSelected={selectedFieldId === element.id}
                  key={`element-${element.id}`}
                  moveFieldDown={moveFieldDown}
                  moveFieldUp={moveFieldUp}
                  setSelectedFieldId={setSelectedFieldId}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Page>
  )
}

FormBuilder.propTypes = {
  selectedFieldId: PropTypes.string,
  form: PropTypes.shape({
    id: PropTypes.string,
    purpose: PropTypes.string,
    structure: PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          component: PropTypes.string,
        }).isRequired,
      ).isRequired,
    }),
  }).isRequired,
  setSelectedFieldId: PropTypes.func.isRequired,
  addField: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  moveFieldUp: PropTypes.func.isRequired,
  moveFieldDown: PropTypes.func.isRequired,
}

FormBuilder.defaultProps = {
  selectedFieldId: null,
}

export default FormBuilder
