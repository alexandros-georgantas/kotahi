import React from 'react'
import { decorate, injectable } from 'inversify'
import { isEmpty } from 'lodash'
import { LeftSideButton, Commands, Tools } from 'wax-prosemirror-core'
import { wrapIn } from 'prosemirror-commands'
import i18next from 'i18next'

class Appendix extends Tools {
  title = i18next.t('waxEditor.Change to appendix')
  label = i18next.t('waxEditor.Appendix')
  name = 'Appendix'

  // eslint-disable-next-line class-methods-use-this
  // get run() {
  //   return (state, dispatch) => {
  //     Commands.setBlockType(state.config.schema.nodes.appendix)(
  //       state,
  //       dispatch,
  //     )
  //   }
  // }
  // eslint-disable-next-line class-methods-use-this
  get run() {
    return (state, dispatch) => {
      wrapIn(state.config.schema.nodes.appendix)(state, dispatch)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get active() {
    return (state, activeViewId) => {
      let isActive = false
      if (activeViewId !== 'main') return false

      const { from, to } = state.selection
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'appendix') {
          isActive = true
        }
      })
      return isActive
    }
  }

  // eslint-disable-next-line class-methods-use-this
  select = (state, activeViewId) => {
    if (activeViewId !== 'main') return false
    return true
  }

  // eslint-disable-next-line class-methods-use-this
  get enable() {
    return state => {
      return Commands.setBlockType(state.config.schema.nodes.appendix)(state)
    }
  }

  renderTool(view) {
    if (isEmpty(view)) return null
    // eslint-disable-next-line no-underscore-dangle
    return this._isDisplayed ? (
      <LeftSideButton item={this.toJSON()} key="Appendix" view={view} />
    ) : null
  }
}

decorate(injectable(), Appendix)

export default Appendix
