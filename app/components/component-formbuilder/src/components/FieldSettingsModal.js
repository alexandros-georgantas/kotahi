import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { ErrorMessage, Formik } from 'formik'
import { v4 as uuid } from 'uuid'
import ValidatedField from '../../../component-submit/src/components/ValidatedField'
import {
  fieldOptionsByCategory,
  determineFieldAndComponent,
  combineExistingPropValuesWithDefaults,
} from './config/Elements'
import * as elements from './builderComponents'
import {
  Section,
  Subsection,
  Legend,
  ErrorMessageWrapper,
  DetailText,
} from './style'
import Modal from '../../../component-modal/src/Modal'
import { ActionButton, MediumRow, Select } from '../../../shared'

const ValidationSubFields = ({ values, setFieldValue }) => {
  const subFields = (values.validate || []).filter(x =>
    ['minChars', 'maxChars', 'minSize'].includes(x.value),
  )

  if (!subFields.length) return null

  return (
    <Subsection>
      {subFields.map(vOption => (
        <div key={vOption.value}>
          <MediumRow>
            <Legend space>{vOption.label}</Legend>
            <ErrorMessageWrapper>
              <ErrorMessage name={`validateValue.${vOption.value}`} />
            </ErrorMessageWrapper>
          </MediumRow>
          <ValidatedField
            component={elements.TextField}
            name={`validateValue.${vOption.value}`}
            onChange={val => {
              if (isEmpty(val)) {
                setFieldValue(`validateValue.${vOption.value}`, null)
                return
              }

              setFieldValue(
                `validateValue.${vOption.value}`,
                val.target ? val.target.value : val,
              )
            }}
            required
            shouldAllowFieldSpecChanges
            validate={val => {
              const n = Math.floor(Number(val))
              if (n === Infinity || String(n) !== val || n <= 0)
                return 'Must be an integer > 0'
              return null
            }}
          />
        </div>
      ))}
    </Subsection>
  )
}

const getValuesPaddedWithDefaults = (
  fieldValues,
  fieldType,
  componentOption,
) => {
  return combineExistingPropValuesWithDefaults(
    {
      ...fieldValues,
      fieldType,
      component: componentOption?.component || null,
    },
    componentOption,
  )
}

/** Remove any field properties that may have been disabled by configuration,
 * such as the Hypothesis tag.
 */
const filterOutPropsDisabledByConfig = (
  fieldOpts,
  shouldAllowHypothesisTagging,
) =>
  fieldOpts.map(opt => ({
    ...opt,
    componentOptions: opt.componentOptions.map(x => {
      const props = Object.fromEntries(
        Object.entries(x.props).filter(
          ([key]) => key !== 'publishingTag' || shouldAllowHypothesisTagging,
        ),
      )

      return { ...x, props }
    }),
  }))

const usesReservedName = (fieldOpt, reservedFieldNames) => {
  const forcedName = fieldOpt.componentOptions[0].props.name?.forcedValue
  if (forcedName && reservedFieldNames.includes(forcedName)) return true
  return false
}

const FieldSettingsModal = ({
  category,
  field,
  onSubmit,
  shouldAllowHypothesisTagging,
  isOpen,
  onClose,
  reservedFieldNames,
}) => {
  if (!isOpen) return null // To ensure Formik gets new initialValues whenever this is reopened
  if (!field) return null

  const fieldOpts = filterOutPropsDisabledByConfig(
    fieldOptionsByCategory[category],
    shouldAllowHypothesisTagging,
  ).filter(fieldOpt => !usesReservedName(fieldOpt, reservedFieldNames))

  const {
    fieldOption: initialFieldOption,
    componentOption: initialComponentOption,
  } = determineFieldAndComponent(field.name, field.component, category)

  const [fieldType, setFieldType] = useState(initialFieldOption?.fieldType)

  const [componentType, setComponentType] = useState(
    initialComponentOption?.component,
  )

  const fieldOption = fieldOpts.find(x => x.value === fieldType)

  const componentOption = fieldOption?.componentOptions.find(
    x => x.value === componentType,
  )

  const initialValues = getValuesPaddedWithDefaults(
    field,
    fieldType,
    componentOption,
  )

  const editableProperties = Object.entries(
    componentOption?.props || {},
  ).filter(([key, value]) => value.component !== 'Hidden')

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(
          prepareForSubmit(values, componentOption.props, fieldOption.readonly),
        )
        actions.resetForm()
        onClose()
      }}
      validateOnBlur
    >
      {({ errors, handleSubmit, setFieldValue, touched, values }) => {
        const populateDefaultValues = (newFieldType, newComponentType) => {
          const newFieldOption = fieldOpts.find(
            opt => opt.fieldType === newFieldType,
          )

          const newComponentOption =
            newFieldOption.componentOptions.find(
              x => x.component === newComponentType,
            ) || newFieldOption.componentOptions[0]

          const newValues = getValuesPaddedWithDefaults(
            values,
            newFieldOption.fieldType,
            newComponentOption,
          )

          newValues.fieldType = newFieldOption.fieldType
          newValues.component = newComponentOption.component

          Object.entries(newValues).forEach(([key, value]) =>
            setFieldValue(key, value),
          )
        }

        const formIsValid = !Object.keys(errors).length

        return (
          <form onSubmit={handleSubmit}>
            <Modal
              contentStyles={{ minWidth: '800px' }}
              isOpen={isOpen}
              leftActions={
                !formIsValid && (
                  <ErrorMessageWrapper>
                    Correct invalid values before saving
                  </ErrorMessageWrapper>
                )
              }
              onClose={onClose}
              rightActions={
                <>
                  <ActionButton onClick={handleSubmit} primary type="submit">
                    Save
                  </ActionButton>
                  <ActionButton onClick={onClose}>Cancel</ActionButton>
                </>
              }
              shouldCloseOnOverlayClick={false}
              title="Field Properties"
            >
              <Section>
                <Legend space>Field type</Legend>
                <ValidatedField
                  component={Select}
                  hasGroupedOptions
                  name="fieldType"
                  onChange={option => {
                    const { component } = fieldOpts.find(
                      opt => opt.value === option.value,
                    ).componentOptions[0]

                    setFieldType(option.value)
                    setFieldValue('fieldType', option.value)
                    setComponentType(component)
                    setFieldValue('component', component)
                    populateDefaultValues(option.value, componentType)
                  }}
                  options={[
                    {
                      label: 'Generic field types',
                      options: fieldOpts.filter(x => x.isCustom),
                    },
                    {
                      label: 'Special fields',
                      options: fieldOpts.filter(x => !x.isCustom),
                    },
                  ]}
                  required
                />
              </Section>
              {fieldOption && fieldOption.componentOptions.length > 1 && (
                <Section>
                  <Legend space>Data type</Legend>
                  <ValidatedField
                    component={Select}
                    name="component"
                    onChange={option => {
                      setComponentType(option.value)
                      setFieldValue('component', option.value)
                      populateDefaultValues(fieldType, option.value)
                    }}
                    options={fieldOption.componentOptions}
                    required
                  />
                </Section>
              )}
              {editableProperties.map(([key, value]) => {
                return (
                  <>
                    <Section key={key}>
                      <MediumRow>
                        <Legend space>
                          {value.props?.label ?? `Field ${key}`}
                        </Legend>
                        <ErrorMessageWrapper>
                          <ErrorMessage name={key} />
                        </ErrorMessageWrapper>
                      </MediumRow>
                      <ValidatedField
                        component={elements[value.component]}
                        name={key}
                        onChange={val => {
                          if (isEmpty(val)) {
                            setFieldValue(key, null)
                            return
                          }

                          setFieldValue(
                            key,
                            val.target ? val.target.value : val,
                          )
                        }}
                        required={key === 'name' || key === 'title'}
                        {...{
                          ...value.props,
                          label: undefined,
                          description: undefined,
                        }}
                        shouldAllowFieldSpecChanges
                        validate={
                          key === 'name'
                            ? val => {
                                if (reservedFieldNames.includes(val))
                                  return 'This name is already in use for another field'
                                if (value.props?.validate)
                                  return value.props.validate(val)
                                return null
                              }
                            : value.props?.validate
                        }
                      />
                      {value.props?.description && (
                        <DetailText>{value.props.description}</DetailText>
                      )}
                    </Section>
                    {key === 'validate' && (
                      <ValidationSubFields
                        setFieldValue={setFieldValue}
                        values={values}
                      />
                    )}
                  </>
                )
              })}
              {!editableProperties.some(([key]) => key === 'name') &&
                values.name && (
                  <Section key="name">
                    <Legend>Internal field name</Legend> {values.name}
                  </Section>
                )}
            </Modal>
          </form>
        )
      }}
    </Formik>
  )
}

FieldSettingsModal.propTypes = {
  category: PropTypes.oneOf(['submission', 'review', 'decision']).isRequired,
  onSubmit: PropTypes.func.isRequired,
}

FieldSettingsModal.defaultProps = {}

/** Because a user can switch between field/component types in the form, and it
 * doesn't immediately delete unused properties, we need to scrub the data before
 * it is submitted. This removes all but the relevant properties for the chosen
 * field/component, and removes any unsupported options. It also adds a uuid to
 * every item in an array property.
 */
const prepareForSubmit = (values, fieldProps, readonly) => {
  const cleanedValues = Object.fromEntries(
    Object.entries(fieldProps)
      .map(([propName, propDefinition]) => {
        let value = values[propName]
        if (!value) return null

        const props = propDefinition || {}

        if (props.options) {
          if (props.isMulti) {
            value = value.filter(x =>
              props.options.some(opt => opt.value === x.value),
            )
          } else if (
            !propDefinition.props.options.some(opt => opt.value === value)
          )
            return null
        }

        if (Array.isArray(value)) value = value.map(x => ({ id: uuid(), ...x }))

        return [propName, value]
      })
      .filter(Boolean),
  )

  cleanedValues.component = values.component
  cleanedValues.readonly = readonly
  cleanedValues.validateValue = Object.keys(values.validateValue || {}).length
    ? values.validateValue
    : null
  return cleanedValues
}

export default FieldSettingsModal
