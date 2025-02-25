import { decorate, injectable } from 'inversify'
import { toggleMark } from 'prosemirror-commands'
import { Commands, Tools } from 'wax-prosemirror-core'
import i18next from 'i18next'

class GlossaryTerm extends Tools {
  title = i18next.t('waxEditor.Change to glossary term')
  label = i18next.t('waxEditor.Glossary term')
  // color = 'colorGlossaryTerm'
  // className = 'glossaryTerm'
  // icon = 'title'
  name = 'GlossaryTerm'

  // eslint-disable-next-line class-methods-use-this
  get run() {
    return (state, dispatch) => {
      toggleMark(state.config.schema.marks.glossaryTerm)(state, dispatch)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  select = state => {
    const {
      selection: { from },
    } = state

    if (from === null) return false
    return true
  }

  // eslint-disable-next-line class-methods-use-this
  get active() {
    return state => {
      return Commands.markActive(state.config.schema.marks.glossaryTerm)(state)
    }
  }
}

decorate(injectable(), GlossaryTerm)

export default GlossaryTerm
