import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { DragVerticalIcon } from '../../../shared/Icons'
import { LayoutHeaderListContainer, LayoutHeaderListItem } from '../style'

const reorder = (list, fromIndex, toIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)

  const reorderedItems = result.map((item, index) => {
    item.sequenceIndex = index + 1 // eslint-disable-line no-param-reassign
    return item
  })

  return reorderedItems
}

const reformObject = values => {
  return values.map(item => ({
    id: item.id,
    title: item.title,
    sequenceIndex: item.sequenceIndex,
    shownInMenu: item.shownInMenu,
    config: item.config,
    url: item.url,
  }))
}

const PageOrder = ({ initialItems, onPageOrderUpdated, curLang }) => {
  const [items, setItems] = React.useState(reformObject(initialItems))

  const updateItems = updatedItems => {
    setItems(updatedItems)
    onPageOrderUpdated(updatedItems)
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const updatedItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    ).map(item => {
      return { ...item, lang: curLang || 'en' }
    })

    updateItems(updatedItems)
  }

  const toggleChange = (item, index) => {
    const updatedItems = Array.from(items).map(changedItem => {
      return { ...changedItem, lang: curLang || 'en' }
    })

    updatedItems[index].shownInMenu = !item.shownInMenu
    updateItems(updatedItems)
  }

  const renderItemList = (item, index, lang) => {
    return (
      <Draggable draggableId={item.id} index={index} key={item.id}>
        {(provided, snapshot) => (
          <LayoutHeaderListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <input
                checked={item.shownInMenu || false}
                name={item.id}
                onChange={() => toggleChange(item, index)}
                style={{ margin: '10px' }}
                type="checkbox"
                value={item.id || false}
              />
              {item.title[lang] || item.url}
            </div>
            <DragVerticalIcon />
          </LayoutHeaderListItem>
        )}
      </Draggable>
    )
  }

  useState(() => {
    if (!curLang) return

    const curLangItems = items
      .map(item => {
        if (!Object.keys(item.config).length) return item

        let curConfig = item.config[curLang]

        if (!item.config[curLang])
          curConfig = item.config[Object.keys(item.config)[0]]

        return {
          ...item,
          shownInMenu: curConfig.shownInMenu,
          sequenceIndex: curConfig.sequenceIndex,
        }
      })
      .sort((page1, page2) => {
        if (page1.sequenceIndex < page2.sequenceIndex) return -1
        if (page1.sequenceIndex > page2.sequenceIndex) return 1
        return 0
      })

    setItems(curLangItems)
  }, [curLang, items])

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <LayoutHeaderListContainer
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
              ref={provided.innerRef}
            >
              {items.map((item, index) => renderItemList(item, index, curLang))}
              {provided.placeholder}
            </LayoutHeaderListContainer>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default PageOrder
