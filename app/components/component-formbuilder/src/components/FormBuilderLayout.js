import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { forEach } from 'lodash'
import styled, { withTheme } from 'styled-components'
import { v4 as uuid } from 'uuid'
import { Action, Icon } from '@pubsweet/ui'
import FormSettingsModal from './FormSettingsModal'
import FieldSettingsModal from './FieldSettingsModal'
import FormBuilder from './FormBuilder'
import {
  Container,
  Heading,
  HiddenTabs,
  SectionContent,
  SectionRow,
  TightRow,
  ActionButton,
  RoundIconButton,
} from '../../../shared'
import { ConfirmationModal } from '../../../component-modal/src/ConfirmationModal'
import FormSummary from './FormSummary'
import { color } from '../../../../theme'
import { ConfigContext } from '../../../config/src'

const AddFieldButton = styled(RoundIconButton)`
  flex: 0 0 40px;
  margin: 8px 0 0 28px;
`

const IconAction = styled(Action)`
  line-height: 1.15;
  vertical-align: text-top;
`

const UnpaddedIcon = styled(Icon)`
  line-height: 1.15;
  padding: 0;
  vertical-align: text-top;
`

const ControlIcon = withTheme(({ children, theme }) => (
  <UnpaddedIcon color={color.brand1.base()}>{children}</UnpaddedIcon>
))

const AddFormButton = styled(ActionButton)`
  position: absolute;
  right: 0;
`

const WidthLimiter = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  max-width: 1200px;
  min-height: 0;
`

const TabLabel = styled.div`
  color: ${({ isActive }) => (isActive ? color.text : color.gray50)};
`

/** Order by default first, then active forms first, then alphabetically */
const getFormsOrderedActiveFirstThenAlphabetical = forms =>
  forms?.toSorted((a, b) => {
    const isDefaultComparison = (a.isDefault ? 0 : 1) - (b.isDefault ? 0 : 1)
    if (isDefaultComparison) return isDefaultComparison
    const isActiveComparison = (a.isActive ? 0 : 1) - (b.isActive ? 0 : 1)
    if (isActiveComparison) return isActiveComparison
    const nameA = a?.structure?.name?.toUpperCase()
    const nameB = b?.structure?.name?.toUpperCase()
    // eslint-disable-next-line no-nested-ternary
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
  })

const FormBuilderLayout = ({
  forms,
  selectedFormId,
  selectedFieldId,
  category,
  deleteForm,
  deleteField,
  dragField,
  moveFieldDown,
  moveFieldUp,
  updateForm,
  createForm,
  updateField,
  setSelectedFieldId,
  setSelectedFormId,
  shouldAllowHypothesisTagging,
  submissionFormUseCounts,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [formId, setFormId] = useState()
  const [isEditingFormSettings, setIsEditingFormSettings] = useState(false)
  const [isEditingFieldSettings, setIsEditingFieldSettings] = useState(false)
  const config = useContext(ConfigContext)

  const openModalHandler = id => {
    setOpenModal(true)
    setFormId(id)
  }

  const closeModalHandler = () => {
    setOpenModal(false)
  }

  const orderedForms = getFormsOrderedActiveFirstThenAlphabetical(forms)

  const sections = []
  forEach(orderedForms, form => {
    sections.push({
      content: (
        <SectionContent
          style={{ display: 'flex', flexDirection: 'column', minHeight: '0' }}
        >
          <SectionRow
            style={{
              display: 'flex',
              flex: '1 1 0%',
              flexDirection: 'row',
              gap: '16px',
              minHeight: '0',
              width: '100%',
            }}
          >
            <div
              style={{
                flex: '1 1 100%',
                minHeight: '0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <FormSummary
                form={form}
                openFormSettingsDialog={() => setIsEditingFormSettings(true)}
              />
              <FormBuilder
                addField={updateField}
                category={category}
                deleteField={deleteField}
                dragField={dragField}
                form={form}
                moveFieldDown={fieldId => moveFieldDown(form, fieldId)}
                moveFieldUp={fieldId => moveFieldUp(form, fieldId)}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={id => {
                  setSelectedFieldId(id)
                  if (id) setIsEditingFieldSettings(true)
                }}
              />
              <AddFieldButton
                iconName="Plus"
                onClick={() => {
                  setSelectedFieldId(uuid())
                  setIsEditingFieldSettings(true)
                }}
                primary
                title="Add a field..."
              />
            </div>
          </SectionRow>
        </SectionContent>
      ),
      key: `${form.id}`,
      label: (
        <TightRow>
          <TabLabel isActive={form.isActive}>
            {form.structure.name || 'Unnamed form'}
          </TabLabel>
          {!form.isActive && (
            <IconAction
              key="delete-form"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                openModalHandler({
                  variables: { formId: form.id },
                })
                setSelectedFormId(forms.find(f => f.id !== form.id)?.id ?? null)
              }}
            >
              <ControlIcon size={2.5}>x</ControlIcon>
            </IconAction>
          )}
        </TightRow>
      ),
    })
  })

  const selectedForm = forms?.find(f => f.id === selectedFormId) ?? {
    category,
    structure: {
      children: [],
      isActive: false,
      isDefault: false,
      name: '',
      purpose: category === 'submission' ? '' : category,
      description: '',
      haspopup: 'false',
    },
  }

  const selectedField = selectedForm.structure.children.find(
    elem => elem.id === selectedFieldId,
  ) || { id: selectedFieldId, component: null }

  const reservedFieldNames = selectedForm.structure.children
    .filter(field => field.id !== selectedFieldId)
    .map(field => field.name)

  const isLastActiveFormInCategory =
    selectedForm.isActive &&
    !forms.some(
      f =>
        f.id !== selectedForm.id &&
        f.category === selectedForm.category &&
        f.isActive,
    )

  return (
    <>
      <Container
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'hidden',
        }}
      >
        <WidthLimiter>
          <Heading>
            {category.charAt(0).toUpperCase() + category.slice(1)} Form Builder
          </Heading>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '0',
              overflow: 'hidden',
              flex: '1',
            }}
          >
            <AddFormButton
              isCompact
              onClick={() => {
                setSelectedFormId(null)
                setIsEditingFormSettings(true)
              }}
            >
              Add new form
            </AddFormButton>
            <HiddenTabs
              defaultActiveKey={selectedFormId ?? null}
              onChange={tab => {
                setSelectedFormId(tab)
                setSelectedFieldId(null)
              }}
              sections={sections}
              shouldFillFlex
            />
          </div>
        </WidthLimiter>
      </Container>

      <FormSettingsModal
        form={selectedForm}
        isLastActiveFormInCategory={isLastActiveFormInCategory}
        isOpen={isEditingFormSettings}
        onClose={() => setIsEditingFormSettings(false)}
        onSubmit={async updatedForm => {
          const payload = {
            variables: { form: { ...updatedForm, groupId: config.groupId } },
          }

          if (selectedForm.id) await updateForm(payload)
          else await createForm(payload)
        }}
        submissionFormUseCounts={submissionFormUseCounts}
      />

      <FieldSettingsModal
        category={selectedForm.category}
        field={selectedField}
        isOpen={isEditingFieldSettings}
        onClose={() => setIsEditingFieldSettings(false)}
        onSubmit={element => {
          updateField({
            variables: {
              formId: selectedForm.id,
              element,
            },
          })
        }}
        reservedFieldNames={reservedFieldNames}
        shouldAllowHypothesisTagging={shouldAllowHypothesisTagging}
      />

      <ConfirmationModal
        closeModal={closeModalHandler}
        confirmationAction={() => deleteForm(formId)}
        confirmationButtonText="Delete"
        isOpen={openModal}
        message="Permanently delete this form?"
      />
    </>
  )
}

FormBuilderLayout.propTypes = {
  forms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      structure: PropTypes.shape({
        purpose: PropTypes.string,
        children: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            component: PropTypes.string,
          }).isRequired,
        ).isRequired,
      }).isRequired,
    }).isRequired,
  ),
  selectedFormId: PropTypes.string,
  selectedFieldId: PropTypes.string,
  deleteForm: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  moveFieldDown: PropTypes.func.isRequired,
  moveFieldUp: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  setSelectedFieldId: PropTypes.func.isRequired,
  setSelectedFormId: PropTypes.func.isRequired,
}

FormBuilderLayout.defaultProps = {
  forms: [],
  selectedFormId: null,
  selectedFieldId: null,
}

export default FormBuilderLayout
