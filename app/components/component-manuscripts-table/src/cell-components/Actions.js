import React, { useState } from 'react'
import { UserAction as Action } from '../style'
// import { Action, ActionGroup } from '@pubsweet/ui'
import { articleStatuses } from '../../../../globals'
import { ConfirmationModal } from '../../../component-modal/src'

// const EditorItemLinks = ({ version, urlFrag }) => (
//   <StyledActionGroup>
//     <Action to={`${urlFrag}/versions/${version.parentId || version.id}/submit`}>
//       Summary Info
//     <Action
//       to={`${urlFrag}/versions/${version.parentId || version.id}/decision`}
//     >
//       <Users />
//       DECISION
//     </Action>
//     <Action
//       data-testid="control-panel"
//       to={`${urlFrag}/versions/${version.parentId || version.id}/decision`}
//     >
//       Control Panel
//       <MessageSquare />
//       TEAM
//     </Action>
//   </StyledActionGroup>
// )

const Actions = ({
  manuscript,
  archiveManuscript,
  isManuscriptBlockedFromPublishing,
  tryPublishManuscript,
  urlFrag,
}) => {
  const [confirmArchiveModalIsOpen, setConfirmArchiveModalIsOpen] = useState(
    false,
  )

  return (
    <>
      {['elife', 'ncrc'].includes(process.env.INSTANCE_NAME) &&
        [
          articleStatuses.submitted,
          articleStatuses.evaluated,
          articleStatuses.new,
          articleStatuses.published,
        ].includes(manuscript.status) && (
          <Action to={`${urlFrag}/versions/${manuscript.id}/evaluation`}>
            Evaluation
          </Action>
        )}
      {['aperture', 'colab'].includes(process.env.INSTANCE_NAME) && (
        <Action to={`${urlFrag}/versions/${manuscript.id}/decision`}>
          Control
        </Action>
      )}
      <Action to={`${urlFrag}/versions/${manuscript.id}/manuscript`}>
        View
      </Action>
      <Action onClick={() => setConfirmArchiveModalIsOpen(true)}>
        Archive
      </Action>
      <Action to={`${urlFrag}/versions/${manuscript.id}/production`}>
        Production
      </Action>
      {['elife', 'ncrc'].includes(process.env.INSTANCE_NAME) &&
        manuscript.status === articleStatuses.evaluated && (
          <Action
            isDisabled={isManuscriptBlockedFromPublishing(manuscript.id)}
            onClick={() => tryPublishManuscript(manuscript)}
          >
            Publish
          </Action>
        )}
      <ConfirmationModal
        closeModal={() => setConfirmArchiveModalIsOpen(false)}
        confirmationAction={() => archiveManuscript(manuscript.id)}
        isOpen={confirmArchiveModalIsOpen}
        message="Please confirm you would like to archive this manuscript"
      />
    </>
  )
}

export default Actions
