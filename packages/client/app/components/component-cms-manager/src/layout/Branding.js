import React from 'react'

import { required } from 'xpub-validators'
import { ValidatedFieldFormik } from '@pubsweet/ui'
import { useTranslation } from 'react-i18next'
import { CompactSection, LayoutMainHeading } from '../style'

import { inputComponents } from '../FormSettings'

import { FilesUpload } from '../../../shared'

const FileInputComponent = ({ entityId, language, ...restProps }) => {
  return (
    <FilesUpload
      acceptMultiple={false}
      fieldName={`${language}.logo`}
      fileType="cms"
      manuscriptId={entityId} // TODO This actually sets the file's objectId. Need to rationalise FilesUpload to use objectId rather than manuscriptId and reviewId.
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
  language,
  formikProps,
  cmsLayout,
  createFile,
  deleteFile,
  updateCmsLayout,
}) => {
  const onDataChanged = (name, value) => {
    formikProps.setFieldValue(`${language}.${name}`, value)
    const delta = {}
    delta[name] = value === undefined ? null : value
    updateCmsLayout(delta)
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
      <CompactSection key={brandLogoInput.name}>
        <LayoutMainHeading>{t('cmsPage.layout.Brand logo')}</LayoutMainHeading>
        <ValidatedFieldFormik
          component={brandLogoInput.component}
          confirmBeforeDelete
          createFile={createFile}
          deleteFile={deleteFile}
          entityId={cmsLayout.id}
          language={language}
          name={`${language}.${brandLogoInput.name}`}
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
          <CompactSection key={item.name}>
            <p style={{ fontSize: '14px' }}>{item.label}</p>
            <ValidatedFieldFormik
              component={item.component}
              name={`${language}.${item.name}`}
              onChange={value => {
                if (value.target) onDataChanged(item.name, value.target.value)
                else onDataChanged(item.name, value)
              }}
              setFieldValue={formikProps.setFieldValue}
              setTouched={formikProps.setTouched}
              type={item.type}
              validate={item.isRequired ? required : null}
              {...item.otherProps}
            />
          </CompactSection>
        )
      })}
    </>
  )
}

export default Branding
