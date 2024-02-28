import React, { useCallback, useEffect, useState } from 'react'
import { ValidatedFieldFormik } from '@pubsweet/ui'
import { adopt } from 'react-adopt'
import { debounce, kebabCase } from 'lodash'
import { required } from 'xpub-validators'
import { useTranslation } from 'react-i18next'
import { inputFields } from '../FormSettings'
import { getSpecificFilesQuery } from '../../../asset-manager/src/queries'
import withModal from '../../../asset-manager/src/ui/Modal/withModal'
import { ConfirmationModal } from '../../../component-modal/src/ConfirmationModal'
import PublishStatus from '../components/PublishStatus'

import {
  Section,
  Page,
  EditorForm,
  ActionButtonContainer,
  FormActionButton,
  FormActionDelete,
  ErrorMessage,
} from '../style'

// Todo: Currently this is breaking the rules of keeping all the server calls
// and everything on the top-level component.
// We need to fix it and pass the getSpecificFilesQuery as a function
// something like getFilesById which takes the ids and returns the files.

const mapper = {
  getSpecificFilesQuery,
  withModal,
}

const mapProps = args => ({
  onAssetManager: manuscriptId => {
    return new Promise((resolve, reject) => {
      const {
        withModal: { showModal, hideModal },
      } = args

      const handleImport = async selectedFileIds => {
        const {
          getSpecificFilesQuery: { client, query },
        } = args

        const { data } = await client.query({
          query,
          variables: { ids: selectedFileIds },
        })

        const { getSpecificFiles } = data

        const alteredFiles = getSpecificFiles.map(getSpecificFile => {
          const mediumSizeFile = getSpecificFile.storedObjects.find(
            storedObject => storedObject.type === 'medium',
          )

          return {
            source: mediumSizeFile.url,
            mimetype: mediumSizeFile.mimetype,
            ...getSpecificFile,
          }
        })

        hideModal()
        resolve(alteredFiles)
      }

      showModal('assetManagerEditor', {
        manuscriptId,
        withImport: true,
        handleImport,
      })
    })
  },
})

const Composed = adopt(mapper, mapProps)

const CMSPageEditForm = ({
  isNewPage,
  onSubmit,
  onDelete,
  setFieldValue,
  setTouched,
  key,
  submitButtonText,
  cmsPage,
  curLang,
  autoSaveData,
  customFormErrors,
  resetCustomErrors,
  currentValues,
  flaxSiteUrlForGroup,
  selectedLanguages,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const autoSave = useCallback(debounce(autoSaveData ?? (() => {}), 1000), [])
  useEffect(() => autoSave.flush, [])

  const [newPageTitle, setNewPageTitle] = useState({})
  const [newPageContent, setNewPageContent] = useState({})
  const [mainLanguage, setMainLanguage] = useState('')

  const { t } = useTranslation()

  useEffect(() => {
    if (!selectedLanguages) return
    setMainLanguage(selectedLanguages[0])
  }, [selectedLanguages])

  const updateNewPageStates = (itemKey, value) => {
    if (itemKey === 'title') {
      setNewPageTitle({ ...newPageTitle, [curLang]: value })
    }

    if (itemKey === 'content') {
      setNewPageContent({ ...newPageContent, [curLang]: value })
    }
  }

  useEffect(() => {
    if (!isNewPage) return
    cmsPage.title = newPageTitle // eslint-disable-line no-param-reassign
    cmsPage.content = newPageContent // eslint-disable-line no-param-reassign
  }, [newPageTitle, newPageContent])

  const onDataChanged = (itemKey, value) => {
    const data = {}

    if (itemKey === 'url') {
      value = normalizeUrl(value) // eslint-disable-line no-param-reassign
    }

    data[itemKey] = value

    if (itemKey === 'title') {
      const newVal = { ...cmsPage.title }
      newVal[curLang] = value
      data[itemKey] = newVal
    }

    if (itemKey === 'content') {
      const newVal = { ...cmsPage.content }
      newVal[curLang] = value
      data[itemKey] = newVal
    }

    autoSave(cmsPage.id, data)

    if (Object.keys(customFormErrors).includes(itemKey)) {
      resetCustomErrors()
    }

    // if (isNewPage && itemKey === 'title') {
    //   setUrlBasedOnTitle(value)
    // }
    if (isNewPage) {
      updateNewPageStates(itemKey, value)
    }
  }

  // const setUrlBasedOnTitle = title => {
  //   const fieldKey = 'url'
  //   const titleSlug = `${kebabCase(title)}/`
  //   setFieldValue(fieldKey, titleSlug, false)
  //   onDataChanged(fieldKey, titleSlug)
  // }

  const normalizeUrl = url => {
    const slug = `${kebabCase(url)}/`
    return slug
  }

  useEffect(() => {
    if (!cmsPage) return
    setFieldValue('url', cmsPage.url)
  }, [cmsPage])

  const getInputFieldSpecificProps = (item, { onAssetManager }) => {
    let props = {}

    switch (item.type) {
      case 'text-input':
        props.onChange = value => {
          let val = value

          if (value.target) {
            val = value.target.value
          } else if (value.value) {
            val = value.value
          }

          setFieldValue(item.name, val, false)
          onDataChanged(item.name, val)
        }

        props.staticText = flaxSiteUrlForGroup

        break

      case 'rich-editor':
        props.onChange = value => {
          setFieldValue(item.name, value)
          onDataChanged(item.name, value)
        }

        props.onAssetManager = () => onAssetManager(cmsPage.id)
        break

      default:
        props = {}
    }

    return props
  }

  const renderCustomErrors = item => {
    const error = customFormErrors[item.name]

    if (!error) {
      return null
    }

    return <ErrorMessage>{error}</ErrorMessage>
  }

  const changeLangValues = lang => {
    const defaultLang = Object.keys(cmsPage.title)[0]

    const titleValue = lang
      ? cmsPage.title[lang] ||
        cmsPage.title[mainLanguage] ||
        cmsPage.title[defaultLang]
      : cmsPage.title[mainLanguage] || cmsPage.title[defaultLang]

    const contentValue = lang
      ? cmsPage.content[lang] ||
        cmsPage.content[mainLanguage] ||
        cmsPage.content[defaultLang]
      : cmsPage.content[mainLanguage] || cmsPage.content[defaultLang]

    setFieldValue('title', titleValue)
    setFieldValue('content', contentValue)
  }

  useEffect(() => {
    changeLangValues(curLang)
  }, [curLang])

  const localizeInputFields = fields => {
    return fields.map(field => {
      if (field.label.length) {
        const newField = field
        newField.label = t(`cmsPage.pages.fields.${newField.name}`)
        return newField
      }

      return field
    })
  }

  return (
    <Composed>
      {({ onAssetManager }) => (
        <Page>
          <EditorForm key={key} onSubmit={onSubmit}>
            {localizeInputFields(inputFields).map(item => {
              return (
                <Section
                  flexGrow={item.flexGrow || false}
                  key={item.name + curLang}
                >
                  <p style={{ fontSize: '10px' }}>{item.label}</p>
                  <ValidatedFieldFormik
                    component={item.component}
                    name={item.name}
                    setTouched={setTouched}
                    style={{ width: '100%' }}
                    validate={item.isRequired ? required : null}
                    {...item.otherProps}
                    {...getInputFieldSpecificProps(item, { onAssetManager })}
                  />
                  {renderCustomErrors(item)}
                </Section>
              )
            })}
            <ActionButtonContainer>
              <div>
                <FormActionButton onClick={onSubmit} primary type="button">
                  {submitButtonText}
                </FormActionButton>
                {!isNewPage && (
                  <FormActionDelete
                    onClick={() => setIsConfirmingDelete(true)}
                    style={{ minWidth: '104px' }}
                  >
                    {t('cmsPage.pages.Delete')}
                  </FormActionDelete>
                )}
              </div>
              {!isNewPage && <PublishStatus cmsComponent={cmsPage} />}
            </ActionButtonContainer>
            <ConfirmationModal
              cancelButtonText={t('modals.cmsPageDelete.Cancel')}
              closeModal={() => setIsConfirmingDelete(false)}
              confirmationAction={() => onDelete(cmsPage)}
              confirmationButtonText={t('modals.cmsPageDelete.Delete')}
              isOpen={isConfirmingDelete}
              message={t('modals.cmsPageDelete.permanentlyDelete', {
                pageName: cmsPage.title
                  ? cmsPage.title[Object.keys(cmsPage.title)[0]]
                  : cmsPage.url,
              })}
            />
          </EditorForm>
        </Page>
      )}
    </Composed>
  )
}

export default CMSPageEditForm
