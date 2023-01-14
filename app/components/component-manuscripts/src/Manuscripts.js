/* eslint-disable no-shadow */
import React, { useState } from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Checkbox } from '@pubsweet/ui'
import { grid } from '@pubsweet/ui-toolkit'
import {
  SelectAllField,
  SelectedManuscriptsNumber,
  ControlsContainer,
} from './style'
import {
  Container,
  Spinner,
  ScrollableContent,
  Heading,
  CommsErrorBanner,
  Pagination,
  PaginationContainerShadowed,
  Columns,
  RoundIconButton,
  ActionButton,
} from '../../shared'
import { articleStatuses } from '../../../globals'
import MessageContainer from '../../component-chat/src/MessageContainer'
import Modal from '../../component-modal/src/ConfirmationModal'
import BulkArchiveModal from './BulkArchiveModal'
import SearchControl from './SearchControl'
import { validateManuscriptSubmission } from '../../../shared/manuscriptUtils'
import {
  URI_SEARCH_PARAM,
  URI_PAGENUM_PARAM,
} from '../../../shared/urlParamUtils'
import ManuscriptsTable from '../../component-manuscripts-table/src/ManuscriptsTable'
import buildColumnDefinitions from '../../component-manuscripts-table/src/util/buildColumnDefinitions'

const OuterContainer = styled(Container)`
  overflow: hidden;
  padding: 0;
`

const ManuscriptsPane = styled.div`
  overflow-y: scroll;
  padding: 16px 16px 0 16px;
`

const FlexRow = styled.div`
  display: flex;
  gap: ${grid(1)};
  justify-content: space-between;
`

const FlexRowWithSmallGapAbove = styled(FlexRow)`
  margin-top: 10px;
`

const Manuscripts = ({ history, ...props }) => {
  const {
    applyQueryParams,
    validateDoi,
    validateSuffix,
    setReadyToEvaluateLabels,
    deleteManuscriptMutations,
    importManuscripts,
    isImporting,
    publishManuscripts,
    queryObject,
    sortDirection,
    sortName,
    systemWideDiscussionChannel,
    page,
    urlFrag,
    chatRoomId,
    configuredColumnNames,
    shouldAllowBulkImport,
    archiveManuscriptMutations,
    confirmBulkArchive,
    uriQueryParams,
  } = props

  const [isOpenBulkArchiveModal, setIsOpenBulkArchiveModal] = useState(false)

  const [selectedNewManuscripts, setSelectedNewManuscripts] = useState([])
  const [isAdminChatOpen, setIsAdminChatOpen] = useState(true)

  const toggleNewManuscriptCheck = id => {
    setSelectedNewManuscripts(s => {
      return selectedNewManuscripts.includes(id)
        ? s.filter(manuscriptId => manuscriptId !== id)
        : [...s, id]
    })
  }

  const toggleAllNewManuscriptsCheck = () => {
    const newManuscriptsFromCurrentPage = manuscripts.filter(
      manuscript =>
        manuscript.status === articleStatuses.new &&
        !manuscript.submission.labels,
    )

    const newManuscriptsFromCurrentPageIds = newManuscriptsFromCurrentPage.map(
      manuscript => manuscript.id,
    )

    const isEveryNewManuscriptIsSelectedFromCurrentPage = newManuscriptsFromCurrentPage.every(
      manuscript => selectedNewManuscripts.includes(manuscript.id),
    )

    setSelectedNewManuscripts(currentSelectedManuscripts => {
      return isEveryNewManuscriptIsSelectedFromCurrentPage
        ? currentSelectedManuscripts.filter(selectedManuscript => {
            if (newManuscriptsFromCurrentPageIds.includes(selectedManuscript))
              return false
            return true
          })
        : [
            ...new Set([
              ...currentSelectedManuscripts,
              ...manuscripts
                .filter(
                  manuscript =>
                    manuscript.status === articleStatuses.new &&
                    !manuscript.submission.labels,
                )
                .map(manuscript => manuscript.id),
            ]),
          ]
    })
  }

  const limit = process.env.INSTANCE_NAME === 'ncrc' ? 100 : 10

  const { loading, error, data } = queryObject

  const deleteManuscript = id => deleteManuscriptMutations(id)

  const archiveManuscript = id => archiveManuscriptMutations(id)

  const [
    manuscriptsBlockedFromPublishing,
    setManuscriptsBlockedFromPublishing,
  ] = useState([])

  const isManuscriptBlockedFromPublishing = id =>
    manuscriptsBlockedFromPublishing.includes(id)

  /** Put a block on the ID while validating and publishing; then unblock it. If the ID is already blocked, do nothing. */
  const tryPublishManuscript = async manuscript => {
    if (isManuscriptBlockedFromPublishing(manuscript.id)) return
    setManuscriptsBlockedFromPublishing(
      manuscriptsBlockedFromPublishing.concat([manuscript.id]),
    )

    const hasInvalidFields = await validateManuscriptSubmission(
      manuscript.submission,
      data.formForPurposeAndCategory?.structure,
      validateDoi,
      validateSuffix,
    )

    if (hasInvalidFields.filter(Boolean).length === 0) {
      await publishManuscripts(manuscript.id)
      setManuscriptsBlockedFromPublishing(
        manuscriptsBlockedFromPublishing.filter(id => id !== manuscript.id),
      )
    }
  }

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  const manuscripts = data.paginatedManuscripts.manuscripts.map(m => {
    return {
      ...m,
      submission: JSON.parse(m.submission),
      manuscriptVersions: m.manuscriptVersions?.map(v => ({
        ...v,
        submission: JSON.parse(v.submission),
      })),
    }
  })

  const fieldDefinitions = {}
  const fields = data.formForPurposeAndCategory?.structure?.children ?? []
  fields.forEach(field => {
    if (field.name) fieldDefinitions[field.name] = field // Incomplete fields in the formbuilder may not have a name specified. Ignore these
  })

  const { totalCount } = data.paginatedManuscripts

  const setReadyToEvaluateLabel = id => {
    if (selectedNewManuscripts.includes(id)) {
      toggleNewManuscriptCheck(id)
    }

    return setReadyToEvaluateLabels(id)
  }

  // eslint-disable-next-line no-unused-vars
  const bulkSetLabelReadyToEvaluate = (selectedNewManuscripts, manuscripts) => {
    manuscripts
      .filter(manuscript => !selectedNewManuscripts.includes(manuscript.id))
      .forEach(manuscript => {
        setReadyToEvaluateLabel(manuscript.id)
      })
  }

  const openModalBulkArchiveConfirmation = () => {
    setIsOpenBulkArchiveModal(true)
  }

  const closeModalBulkArchiveConfirmation = () => {
    setIsOpenBulkArchiveModal(false)
  }

  const doConfirmBulkArchive = () => {
    confirmBulkArchive(selectedNewManuscripts)

    setSelectedNewManuscripts([])
    closeModalBulkArchiveConfirmation()
  }

  const currentSearchQuery = uriQueryParams.get(URI_SEARCH_PARAM)

  // Props for instantiating special components
  const specialComponentValues = {
    deleteManuscript,
    archiveManuscript,
    isManuscriptBlockedFromPublishing,
    tryPublishManuscript,
    selectedNewManuscripts,
    toggleNewManuscriptCheck,
    setReadyToEvaluateLabel,
    urlFrag,
  }

  // Props for filtering / sorting
  const displayProps = {
    uriQueryParams,
    columnToSortOn: sortName,
    sortDirection,
    currentSearchQuery,
  }

  // TODO: refactor to .env config
  const adjustedColumnNames = [...configuredColumnNames]
  adjustedColumnNames.push('actions')
  if (['ncrc', 'colab'].includes(process.env.INSTANCE_NAME))
    adjustedColumnNames.splice(0, 0, 'newItemCheckbox')

  // Source of truth for columns
  const columnsProps = buildColumnDefinitions(
    adjustedColumnNames,
    fieldDefinitions,
    specialComponentValues,
    displayProps,
  )

  const channels = [
    {
      id: systemWideDiscussionChannel?.data?.systemWideDiscussionChannel?.id,
      name: 'Admin discussion',
    },
  ]

  const hideChat = () => setIsAdminChatOpen(false)

  const shouldAllowNewSubmission = ['elife', 'ncrc'].includes(
    process.env.INSTANCE_NAME,
  )

  const shouldAllowBulkDelete = ['ncrc', 'colab'].includes(
    process.env.INSTANCE_NAME,
  )

  const topRightControls = (
    <ControlsContainer>
      {shouldAllowNewSubmission && (
        <ActionButton
          onClick={() => history.push(`${urlFrag}/newSubmission`)}
          primary
        >
          ＋ New submission
        </ActionButton>
      )}
      {shouldAllowBulkImport && (
        <ActionButton
          onClick={importManuscripts}
          status={isImporting ? 'pending' : ''}
        >
          {isImporting ? 'Refreshing' : 'Refresh'}
        </ActionButton>
      )}

      <SearchControl
        applySearchQuery={newQuery =>
          applyQueryParams({
            [URI_SEARCH_PARAM]: newQuery,
            [URI_PAGENUM_PARAM]: 1,
          })
        }
        currentSearchQuery={currentSearchQuery}
      />
      {!isAdminChatOpen && (
        <RoundIconButton
          iconName="MessageSquare"
          onClick={() => setIsAdminChatOpen(true)}
          title="Show admin discussion"
        />
      )}
    </ControlsContainer>
  )

  return (
    <OuterContainer>
      <ToastContainer
        autoClose={5000}
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="top-center"
        rtl={false}
      />
      <Columns>
        <ManuscriptsPane>
          <FlexRow>
            <Heading>Manuscripts</Heading>
            {topRightControls}
          </FlexRow>
          {shouldAllowBulkDelete && (
            <FlexRowWithSmallGapAbove>
              <SelectAllField>
                <Checkbox
                  checked={
                    manuscripts.filter(
                      manuscript =>
                        manuscript.status === articleStatuses.new &&
                        !manuscript.submission.labels,
                    ).length ===
                      manuscripts.filter(manuscript =>
                        selectedNewManuscripts.includes(manuscript.id),
                      ).length && selectedNewManuscripts.length !== 0
                  }
                  label="Select All"
                  onChange={toggleAllNewManuscriptsCheck}
                />
                <SelectedManuscriptsNumber>{`${selectedNewManuscripts.length} articles selected`}</SelectedManuscriptsNumber>
                <ActionButton
                  disabled={selectedNewManuscripts.length === 0}
                  isCompact
                  onClick={openModalBulkArchiveConfirmation}
                  primary={selectedNewManuscripts.length > 0}
                >
                  Archive
                </ActionButton>
              </SelectAllField>
            </FlexRowWithSmallGapAbove>
          )}

          <div>
            <ScrollableContent>
              <ManuscriptsTable
                applyQueryParams={applyQueryParams}
                columnsProps={columnsProps}
                manuscripts={manuscripts}
                sortDirection={sortDirection}
                sortName={sortName}
              />
            </ScrollableContent>
            <Pagination
              limit={limit}
              page={page}
              PaginationContainer={PaginationContainerShadowed}
              setPage={newPage =>
                applyQueryParams({ [URI_PAGENUM_PARAM]: newPage })
              }
              totalCount={totalCount}
            />
          </div>
        </ManuscriptsPane>

        {/* Admin Discussion, Video Chat, Hide Chat, Chat component */}
        {isAdminChatOpen && (
          <MessageContainer
            channelId={
              systemWideDiscussionChannel?.data?.systemWideDiscussionChannel?.id
            }
            channels={channels}
            chatRoomId={chatRoomId}
            hideChat={hideChat}
          />
        )}
      </Columns>
      {['ncrc', 'colab'].includes(process.env.INSTANCE_NAME) && (
        <Modal
          isOpen={isOpenBulkArchiveModal}
          onRequestClose={closeModalBulkArchiveConfirmation}
        >
          <BulkArchiveModal
            closeModal={closeModalBulkArchiveConfirmation}
            confirmBulkArchive={doConfirmBulkArchive}
          />
        </Modal>
      )}
    </OuterContainer>
  )
}

export default Manuscripts
