import React from 'react'

import { required } from 'xpub-validators'
import { ValidatedFieldFormik } from '@pubsweet/ui'
import { useTranslation } from 'react-i18next'
import { CompactSection, LayoutMainHeading } from '../style'

import { inputComponents } from '../FormSettings'

import { FilesUpload } from '../../../shared'

const FileInputComponent = ({ entityId, ...restProps }) => {
  return (
    <FilesUpload
      acceptMultiple={false}
      fieldName="logo"
      fileType="cms"
      manuscriptId={entityId}
      mimeTypesToAccept="image/*"
      {...restProps}
    />
  )
}

const brandLogoInput = {
  component: FileInputComponent,
  label: 'Brand logo',
  name: 'logoId',
  type: 'file',
}

const brandColorInput = [
  {
    component: inputComponents.ColorInput,
    label: 'Primary Color',
    name: 'primaryColor',
    type: 'color',
    value: '#e66465',
  },

  {
    component: inputComponents.ColorInput,
    label: 'Secondary Color',
    name: 'secondaryColor',
    type: 'color',
    value: '#e66465',
  },
]

const Branding = ({
  formikProps,
  cmsLayout,
  createFile,
  deleteFile,
  triggerAutoSave,
  curLang,
}) => {
  const dataForLogos = layout => {
    const prevData = {}
    const existingData = layout.logo || {}

    Object.keys(existingData).forEach(langKey => {
      const curLangData = existingData[langKey]
      prevData[langKey] = curLangData.id
    })
    return prevData
  }

  const onDataChanged = (name, value) => {
    const prevData =
      name === 'logoId' ? dataForLogos(cmsLayout) : { ...cmsLayout[name] }

    prevData[curLang] = value
    formikProps.setFieldValue(name, prevData)
    const data = {}
    data[name] = prevData === undefined ? null : prevData
    triggerAutoSave(data)
  }

  const getInputValue = name => {
    const firstLanguage = cmsLayout.languages[0]
    if (cmsLayout[name][curLang]) return cmsLayout[name][curLang]
    return cmsLayout[name][firstLanguage]
  }

  const { t } = useTranslation()

  const localizeFields = fields => {
    return fields.map(field => {
      if (field.label.length) {
        const newField = field
        newField.label = t(`cmsPage.layout.fields.${newField.name}`)
        return newField
      }

      return field
    })
  }

  return (
    <>
      <CompactSection key={brandLogoInput.name + curLang}>
        <LayoutMainHeading>{t('cmsPage.layout.Brand logo')}</LayoutMainHeading>
        <ValidatedFieldFormik
          component={brandLogoInput.component}
          confirmBeforeDelete
          createFile={createFile}
          curLang={curLang}
          deleteFile={deleteFile}
          entityId={cmsLayout.id}
          name={brandLogoInput.name}
          onChange={value => onDataChanged(brandLogoInput.name, value[0])}
          setFieldValue={formikProps.setFieldValue}
          setTouched={formikProps.setTouched}
          type={brandLogoInput.type}
          validate={brandLogoInput.isRequired ? required : null}
          {...brandLogoInput.otherProps}
        />
      </CompactSection>

      <LayoutMainHeading>{t('cmsPage.layout.Brand Color')}</LayoutMainHeading>
      {localizeFields(brandColorInput).map(item => {
        return (
          <CompactSection key={item.name + curLang}>
            <p style={{ fontSize: '14px' }}>{item.label}</p>
            <ValidatedFieldFormik
              component={item.component}
              name={item.name}
              onChange={value => onDataChanged(item.name, value.target.value)}
              setFieldValue={formikProps.setFieldValue}
              setTouched={formikProps.setTouched}
              type={item.type}
              validate={item.isRequired ? required : null}
              value={getInputValue(item.name)}
              {...item.otherProps}
            />
          </CompactSection>
        )
      })}
    </>
  )
}

export default Branding
