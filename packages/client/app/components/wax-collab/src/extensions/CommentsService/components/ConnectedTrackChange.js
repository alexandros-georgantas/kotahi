/* eslint react/prop-types: 0 */
import React, { useContext, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { WaxContext, DocumentHelpers } from 'wax-prosemirror-core'
import { last, maxBy } from 'lodash'
import { TextSelection } from 'prosemirror-state'
import TrackChangesBox from './ui/trackChanges/TrackChangesBox'
import acceptTrackChange from './ui/trackChanges/AcceptTrackChange'
import rejectTrackChange from './ui/trackChanges/RejectTrackChange'

const ConnectedTrackChangeStyled = styled.div`
  margin-left: ${props => (props.active ? `${-20}px` : `${50}px`)};
  position: absolute;
  width: 200px;

  @media (max-width: 600px) {
    margin-left: 15px;
  }
`

/* eslint-disable-next-line react/function-component-definition */
export default ({ trackChangeId, top, recalculateTops, trackChange }) => {
  const context = useContext(WaxContext)
  const { app, activeView, pmViews } = context
  const user = app.config.get('user')
  const [isActive, setIsActive] = useState(false)
  const { state, dispatch } = activeView
  const [disableForSelf, setDisableForSelf] = useState('!!!')
  const [disableForOthers, setDisableForOthers] = useState(false)

  const viewId = trackChange.attrs
    ? trackChange.attrs.viewid
    : trackChange.node.attrs.viewid

  const styles = {
    top: `${top}px`,
  }

  const trakChangePlugin = app.PmPlugins.get('trackChangePlugin')

  const activeTrackChange = trakChangePlugin.getState(
    activeView.state,
  ).trackChange

  const onClickBox = trackData => {
    if (trackData.node) return focusOnBlcock(trackData)

    if (viewId !== 'main') context.updateView({}, viewId)

    const allTracksWithSameId = DocumentHelpers.findAllMarksWithSameId(
      pmViews[viewId].state,
      trackData,
    )

    const maxPos = maxBy(allTracksWithSameId, 'pos')
    maxPos.pos += last(allTracksWithSameId).node.nodeSize

    pmViews[viewId].dispatch(
      pmViews[viewId].state.tr.setSelection(
        new TextSelection(pmViews[viewId].state.tr.doc.resolve(maxPos.pos - 1)),
      ),
    )

    pmViews[viewId].focus()
    return true
  }

  const focusOnBlcock = trackData => {
    pmViews[viewId].dispatch(
      pmViews[viewId].state.tr.setSelection(
        new TextSelection(
          pmViews[viewId].state.tr.doc.resolve(trackData.pos + 1),
        ),
      ),
    )

    pmViews[viewId].focus()
    return true
  }

  useEffect(() => {
    setIsActive(false)
    recalculateTops()

    if (activeTrackChange && trackChangeId === activeTrackChange.attrs.id) {
      setIsActive(true)
      recalculateTops()
    }

    const acceptConfig = app.config.get('config.AcceptTrackChangeService')
    const rejectConfig = app.config.get('config.RejectTrackChangeService')
    const acceptSelf = acceptConfig.own.accept
    const rejectSelf = rejectConfig.own.reject
    const acceptOthers = acceptConfig.others.accept
    const rejectOthers = rejectConfig.others.reject

    // If the config says not to accept/reject own changes, set the disableForSelf state to the username of the user
    setDisableForSelf(!acceptSelf && !rejectSelf ? user.username : '!!!')

    // If the config says not to accept/reject other changes, set the disableForOthers state to `true`
    setDisableForOthers(!acceptOthers && !rejectOthers)
  }, [activeTrackChange])

  const onClickAccept = () => {
    const acceptConfig = app.config.get('config.AcceptTrackChangeService')
    acceptTrackChange(state, dispatch, user, activeTrackChange, acceptConfig)
    pmViews[viewId].focus()
  }

  const onClickReject = () => {
    const rejectConfig = app.config.get('config.RejectTrackChangeService')
    rejectTrackChange(state, dispatch, user, activeTrackChange, rejectConfig)
    pmViews[viewId].focus()
  }

  const MemorizedTrackChange = useMemo(
    () => (
      <ConnectedTrackChangeStyled
        active={isActive}
        data-box={trackChangeId}
        style={styles}
      >
        <TrackChangesBox
          active={isActive}
          disableForOthers={disableForOthers}
          disableForSelf={disableForSelf}
          key={trackChangeId}
          onClickAccept={onClickAccept}
          onClickBox={onClickBox}
          onClickReject={onClickReject}
          recalculateTops={recalculateTops}
          trackChangeId={trackChangeId}
          trackData={trackChange}
          user={user}
        />
      </ConnectedTrackChangeStyled>
    ),
    [isActive, top],
  )

  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  return <>{MemorizedTrackChange}</>
}
