import React, { useEffect, useState } from 'react'

import { useTranslation, Trans } from 'react-i18next'
import styled, { withTheme } from 'styled-components'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { grid } from '@pubsweet/ui-toolkit'
import { Icon, Action, Button } from '@pubsweet/ui'
import { LayoutMainHeading, LayoutSecondaryHeading } from '../style'
import { RoundIconButton, Select, TightColumn } from '../../../shared'
import { languagesLabels } from '../../../../i18n/index'
import { DragVerticalIcon } from '../../../shared/Icons'
import { color } from '../../../../theme'
import Modal from '../../../component-modal/src/ConfirmationModal'

const AddLangContainer = styled.div`
  margin-left: 54px;
  margin-top: 10px;
  padding: 0 8px;
`

const Handle = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 ${grid(3)};
  height: ${grid(5)};
  justify-content: center;
  width: ${grid(3)};
`

const DragIcon = styled(DragVerticalIcon)`
  height: 20px;
  stroke: ${color.gray40};
  stroke-width: 1.8;
  width: 20px;

  &:hover {
    stroke: ${color.brand1.base};
  }
`

const TaskRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: ${grid('1')};

  &:hover > div:first-child > div:first-child > svg,
  &:hover > div:first-child > button:last-child > svg {
    display: block;
  }
`

const TaskRowContainer = styled.div``

const LanguageSelectWrapper = styled.div`
  margin-bottom: 10px;
  min-width: 25%;
`

const IconAction = styled(Action)`
  flex-grow: 0;
  margin: 0 ${grid(1)};
`

const UnpaddedIcon = styled(Icon)`
  padding: 0;
  vertical-align: text-top;
`

const ModalContainer = styled.div`
  background: ${color.backgroundA};
  padding: 20px 24px;
  z-index: 100;
`

const SmallIcon = withTheme(({ children, theme }) => (
  <UnpaddedIcon color={color.brand1.base()} size={2.5}>
    {children}
  </UnpaddedIcon>
))

const CancelButton = styled(Button)`
  background: ${color.gray90};
  padding: 8px;
  text-decoration: none;

  &:hover {
    background: ${color.gray80};
  }
`

const ConfirmationString = styled.p`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
`

const Langauges = ({
  cmsLayout,
  triggerAutoSave,
  selectedLanguages,
  setSelectedLanguages,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [modalDeleteLang, setModalDeleteLang] = useState()
  const { t } = useTranslation()

  const openModalHandler = index => {
    setOpenModal(true)
    setModalDeleteLang(index)
  }

  const closeModalHandler = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    if (cmsLayout.languages.length) {
      setSelectedLanguages(cmsLayout.languages)
    } else {
      setSelectedLanguages([languagesLabels[0].value])
    }
  }, [])

  useEffect(() => {
    if (!selectedLanguages.length) return
    onDataChanged('languages', selectedLanguages)
  }, [selectedLanguages])

  const onDataChanged = (name, value) => {
    const data = {}
    data[name] = value === undefined ? [] : value
    triggerAutoSave(data)
  }

  const onDragEnd = item => {
    const curLangs = [...selectedLanguages]
    const indexFrom = item.source.index
    const indexTo = item.destination.index
    const indexVal = curLangs[indexFrom]
    curLangs.splice(indexFrom, 1)
    curLangs.splice(indexTo, 0, indexVal)
    setSelectedLanguages(curLangs)
  }

  const addNewLang = () => {
    setSelectedLanguages([...selectedLanguages, languagesLabels[0].value])
  }

  const changeLang = (index, e) => {
    const curLangs = [...selectedLanguages]
    curLangs[index] = e.value
    setSelectedLanguages(curLangs)
  }

  const removeLang = (index, e) => {
    const curLangs = [...selectedLanguages]
    curLangs.splice(index, 1)
    setSelectedLanguages(curLangs)
    setOpenModal(false)
  }

  return (
    <>
      <LayoutMainHeading>
        {t('cmsPage.layout.Choose languages')}
      </LayoutMainHeading>
      <LayoutSecondaryHeading>
        <Trans i18nKey="cmsPage.layout.LanguagesDesc" />
      </LayoutSecondaryHeading>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <TightColumn {...provided.droppableProps} ref={provided.innerRef}>
              {selectedLanguages.map((lang, index) => (
                <Draggable
                  draggableId={`dragId-${index}`}
                  index={index}
                  key={lang}
                >
                  {(providedIn, snapshotIn) => (
                    <>
                      <TaskRowContainer>
                        <TaskRow
                          ref={providedIn.innerRef}
                          {...providedIn.draggableProps}
                        >
                          <Handle {...providedIn.dragHandleProps}>
                            <DragIcon />
                          </Handle>
                          <LanguageSelectWrapper>
                            <Select
                              customStyles={{ flexGrow: 1 }}
                              onChange={e => changeLang(index, e)}
                              options={languagesLabels}
                              placeholder="Choose language"
                              value={lang}
                            />
                          </LanguageSelectWrapper>
                          <IconAction
                            disabled={selectedLanguages.length <= 1}
                            onClick={() => openModalHandler(index)}
                            title={t('cmsPage.layout.Remove language')}
                          >
                            <SmallIcon>x</SmallIcon>
                          </IconAction>
                        </TaskRow>
                      </TaskRowContainer>
                    </>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </TightColumn>
          )}
        </Droppable>
      </DragDropContext>

      <Modal isOpen={openModal}>
        <ModalContainer>
          <ConfirmationString>
            {t('modals.deleteCMSLang.Delete lang')}
          </ConfirmationString>
          <Button
            onClick={event => {
              removeLang(modalDeleteLang)
            }}
            primary
          >
            {t('modals.deleteCMSLang.Ok')}
          </Button>
          &nbsp;
          <CancelButton onClick={() => closeModalHandler()}>
            {t('modals.deleteCMSLang.Cancel')}
          </CancelButton>
        </ModalContainer>
      </Modal>

      <AddLangContainer>
        <RoundIconButton
          disabled={selectedLanguages.length >= 7}
          iconName="Plus"
          onClick={addNewLang}
          primary
          title={t('cmsPage.layout.Add language')}
        />
      </AddLangContainer>
    </>
  )
}

export default Langauges
