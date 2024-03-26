import React, { useEffect, useState } from 'react'

import { useTranslation, Trans } from 'react-i18next'
import styled, { withTheme } from 'styled-components'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { grid } from '@pubsweet/ui-toolkit'
import { Icon, Action } from '@pubsweet/ui'
import { LayoutMainHeading, LayoutSecondaryHeading } from '../style'
import {
  ActionButton,
  LooseRow,
  RoundIconButton,
  Select,
  TightColumn,
} from '../../../shared'
import { languagesLabels } from '../../../../i18n/index'
import { DragVerticalIcon } from '../../../shared/Icons'
import { color } from '../../../../theme'
import { ConfirmationModal } from '../../../component-modal/src/ConfirmationModal'
import Modal from '../../../component-modal/src/Modal'

const AddButton = styled(RoundIconButton)`
  height: 28px;
  width: 28px;
`

const AddLangContainer = styled.div`
  margin-left: 20px;
  margin-top: 10px;
  padding: 0 8px;
`

const Handle = styled.div`
  align-items: center;
  display: flex;
  height: ${grid(3)};
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

const LangItem = styled.div`
  align-items: center;
  background-color: ${color.backgroundC};
  display: flex;
  gap: ${grid(1)};
  justify-content: start;
  width: 300px;

  & > div:nth-child(2) {
    display: block;
    flex: 1 1 100%;
    overflow: hidden;
  }

  & > :first-child,
  & > :nth-child(3) {
    opacity: 0;
  }

  &:hover > :first-child,
  &:hover > :nth-child(3) {
    opacity: 1;
  }

  &:hover > div:first-child > div:first-child > svg,
  &:hover > div:first-child > button:last-child > svg {
    display: block;
  }
`

const TaskRowContainer = styled.div``

const IconAction = styled(Action)`
  flex-grow: 0;
  margin: 0 ${grid(1)};
`

const UnpaddedIcon = styled(Icon)`
  padding: 0;
  vertical-align: text-top;
`

const SmallIcon = withTheme(({ children, theme }) => (
  <UnpaddedIcon color={color.brand1.base()} size={2.5}>
    {children}
  </UnpaddedIcon>
))

const LanguageList = ({ languages, updateLanguages, systemLanguages }) => {
  const [langs, setLangs] = useState(languages)
  const [langBeingDeleted, setLangBeingDeleted] = useState(null)
  const [addModalIsOpen, setAddModalIsOpen] = useState(false)
  const [langToAdd, setLangToAdd] = useState(null)
  const { t } = useTranslation()

  useEffect(() => setLangs(languages), [languages])

  const onDragEnd = ({ source, destination }) => {
    const newLangs = [...langs]
    const [removed] = newLangs.splice(source.index, 1)
    newLangs.splice(destination.index, 0, removed)
    setLangs(newLangs)
    updateLanguages(newLangs)
  }

  return (
    <>
      <LayoutMainHeading>
        {t('cmsPage.layout.Choose languages')}
        <LayoutSecondaryHeading>
          <Trans i18nKey="cmsPage.layout.LanguagesDesc" />
        </LayoutSecondaryHeading>
      </LayoutMainHeading>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <TightColumn {...provided.droppableProps} ref={provided.innerRef}>
              {langs.map((lang, index) => (
                <Draggable
                  draggableId={`dragId-${lang}`}
                  index={index}
                  key={lang}
                >
                  {(providedIn, snapshotIn) => (
                    <>
                      <TaskRowContainer>
                        <LangItem
                          ref={providedIn.innerRef}
                          {...providedIn.draggableProps}
                        >
                          <Handle {...providedIn.dragHandleProps}>
                            <DragIcon />
                          </Handle>
                          <div>
                            {languagesLabels.find(x => x.value === lang)
                              ?.label ?? lang}
                          </div>
                          {langs.length > 1 && (
                            <IconAction
                              disabled={langs.length <= 1}
                              onClick={() => setLangBeingDeleted(lang)}
                              title={t('cmsPage.layout.Remove language')}
                            >
                              <SmallIcon>x</SmallIcon>
                            </IconAction>
                          )}
                        </LangItem>
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
      <AddLangContainer>
        <AddButton
          disabled={langs.length >= 50}
          iconName="Plus"
          onClick={() => setAddModalIsOpen(true)}
          primary
          title={t('cmsPage.layout.Add language')}
        />
      </AddLangContainer>
      <Modal
        isOpen={addModalIsOpen}
        onClose={() => setAddModalIsOpen(false)}
        rightActions={
          <LooseRow>
            <ActionButton
              disabled={!langToAdd}
              onClick={() => {
                setLangs(prev => {
                  const newLangs = [...prev, langToAdd]
                  updateLanguages(newLangs)
                  return newLangs
                })
                setAddModalIsOpen(false)
              }}
              primary
            >
              {t('common.Add')}
            </ActionButton>
            <ActionButton onClick={() => setAddModalIsOpen(false)}>
              {t('common.Cancel')}
            </ActionButton>
          </LooseRow>
        }
        title={t('cmsPage.layout.Add language')}
      >
        <Select
          onChange={item => setLangToAdd(item.value)}
          options={systemLanguages
            .filter(x => !langs.includes(x))
            .map(lang => ({
              value: lang,
              label: languagesLabels.find(x => x.value === lang)?.label ?? lang,
            }))}
        />
      </Modal>
      <ConfirmationModal
        closeModal={() => setLangBeingDeleted(null)}
        confirmationAction={() =>
          setLangs(prev => {
            const newLangs = prev.filter(x => x !== langBeingDeleted)
            updateLanguages(newLangs)
            return newLangs
          })
        }
        confirmationButtonText={t('common.Delete')}
        isOpen={!!langBeingDeleted}
        message={t('modals.deleteCMSLang.Delete lang')}
      />
    </>
  )
}

export default LanguageList
