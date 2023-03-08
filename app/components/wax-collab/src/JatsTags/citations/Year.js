import { decorate, injectable } from 'inversify'
import { Commands } from 'wax-prosemirror-utilities'
import { Tools } from 'wax-prosemirror-services'
import removeOrToggleMark from '../removeOrToggleMark'

class Year extends Tools {
  title = 'Change to year'
  label = 'Year'
  color = 'colorYear'
  className = 'year'
  // icon = 'title'
  name = 'Year'

  // eslint-disable-next-line class-methods-use-this
  get run() {
    return (state, dispatch) => {
      removeOrToggleMark(state, dispatch, 'year')
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
      return Commands.markActive(state.config.schema.marks.year)(state)
    }
  }
}

decorate(injectable(), Year)

export default Year
