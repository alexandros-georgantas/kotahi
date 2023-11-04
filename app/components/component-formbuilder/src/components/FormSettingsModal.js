import React from 'react'
import PropTypes from 'prop-types'
import { omitBy } from 'lodash'
import styled from 'styled-components'
import { TextField } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'
import { AbstractField, RadioBox } from './builderComponents'
import { ActionButton, Checkbox } from '../../../shared'
import ValidatedField from '../../../component-submit/src/components/ValidatedField'
import Modal from '../../../component-modal/src/Modal'
import { DetailText, Section, Legend } from './style'

const InvalidWarning = styled.div`
  color: ${th('colorError')};
`

const FloatRightCheckbox = styled(Checkbox)`
  float: right;
`

const prepareForSubmit = (form, values) => {
  const cleanedValues = omitBy(values, value => value === '')

  const { created, updated, isActive, ...rest } = cleanedValues

  const updatedForm = {
    id: form.id,
    category: form.category,
    isActive,
    structure: rest,
  }

  return updatedForm
}

const FormSettingsModal = ({
  form,
  isOpen,
  canMakeFormInactive,
  makeFormActive,
  makeFormInactive,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null // To ensure Formik gets new initialValues whenever this is reopened

  return (
    <Formik
      initialValues={{
        description: '',
        popupdescription: '',
        isActive: form.isActive,
        ...form.structure,
      }}
      key={form.id}
      onSubmit={(values, actions) => {
        try {
          onSubmit(prepareForSubmit(form, values))
          actions.resetForm()
          onClose()
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      }}
      validate={values => {
        if (!values.name) return ['Please give the form a name.']
        if (form.category === 'submission' && !values.purpose)
          return ['Please choose a purpose identifier.']
        return null
      }}
    >
      {({ handleSubmit, setFieldValue, values, errors }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            contentStyles={{ minWidth: '800px' }}
            isOpen={isOpen}
            leftActions={
              !!Object.keys(errors).length && (
                <InvalidWarning>{errors.join(' — ')}</InvalidWarning>
              )
            }
            onClose={onClose}
            rightActions={
              <>
                <ActionButton onClick={handleSubmit} primary type="submit">
                  {form.id ? 'Update Form' : 'Create Form'}
                </ActionButton>
                <ActionButton onClick={onClose}>Cancel</ActionButton>
              </>
            }
            shouldCloseOnOverlayClick={false}
            title={
              form.id ? `Update Form: ${form.structure.name}` : 'Create Form'
            }
          >
            <FloatRightCheckbox
              checked={values.isActive}
              disabled={
                values.isActive &&
                (form.category !== 'submission' || !canMakeFormInactive)
              }
              handleChange={e => setFieldValue('isActive', !values.isActive)}
              id="formIsActive"
              label="Active"
            />
            <Section id="form.name" key="form.name">
              <Legend>Form title</Legend>
              <ValidatedField
                autoFocus={!form.id}
                component={TextField}
                name="name"
                required
              />
            </Section>
            {form.category === 'submission' && (
              <Section id="form.purpose" key="form.purpose">
                <Legend>Submission type</Legend>
                <ValidatedField component={TextField} name="purpose" required />
                <DetailText>
                  Choose a name that will not change, to uniquely distinguish
                  what type of submission this form is for. (Internal use only.)
                </DetailText>
              </Section>
            )}
            <Section id="form.description" key="form.description">
              <Legend>Description</Legend>
              <ValidatedField
                component={AbstractField}
                name="description"
                onChange={val => {
                  setFieldValue('description', val)
                }}
              />
            </Section>
            <Section id="form.submitpopup" key="form.submitpopup">
              <Legend>Show confirmation page when submitting?</Legend>
              <ValidatedField
                component={RadioBox}
                inline
                name="haspopup"
                onChange={(input, value) => {
                  setFieldValue('haspopup', input)
                }}
                options={[
                  {
                    label: 'Yes',
                    value: 'true',
                  },
                  {
                    label: 'No',
                    value: 'false',
                  },
                ]}
              />
            </Section>
            {values.haspopup === 'true' && [
              <Section id="popup.title" key="popup.title">
                <Legend>Popup Title</Legend>
                <ValidatedField component={TextField} name="popuptitle" />
              </Section>,
              <Section id="popup.description" key="popup.description">
                <Legend>Description</Legend>
                <ValidatedField
                  component={AbstractField}
                  name="popupdescription"
                  onChange={val => {
                    setFieldValue('popupdescription', val)
                  }}
                />
              </Section>,
            ]}
          </Modal>
        </form>
      )}
    </Formik>
  )
}

FormSettingsModal.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.string,
    structure: PropTypes.shape({
      name: PropTypes.string,
      purpose: PropTypes.string,
      description: PropTypes.string,
      haspopup: PropTypes.string.isRequired,
      popuptitle: PropTypes.string,
    }),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

FormSettingsModal.defaultProps = {
  isOpen: false,
}

export default FormSettingsModal
