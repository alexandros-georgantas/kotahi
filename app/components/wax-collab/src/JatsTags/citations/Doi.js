import { decorate, injectable } from 'inversify'
import { Commands } from 'wax-prosemirror-core'
import { Tools } from 'wax-prosemirror-services'
import removeOrToggleMark from '../removeOrToggleMark'

class Doi extends Tools {
  title = 'Change to DOI'
  label = 'DOI'
  color = 'colorDoi'
  className = 'doi'
  // icon = 'title'
  name = 'Doi'

  // eslint-disable-next-line class-methods-use-this
  get run() {
    return (state, dispatch) => {
      removeOrToggleMark(state, dispatch, 'doi')
    }
  }

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
      return Commands.markActive(state.config.schema.marks.doi)(state)
    }
  }
}

decorate(injectable(), Doi)

export default Doi
