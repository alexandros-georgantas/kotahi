import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@pubsweet/ui-toolkit'
import { v4 as uuid } from 'uuid'
import { debounce } from 'lodash'
import { ActionButton, TextInput } from '../../shared'

import TaskNotificationDetails from './TaskNotificationDetails'
import AssigneeDropdown from './AssigneeDropdown'
import DueDateField from './DueDateField'
import Modal from '../../component-modal/src/Modal'
import SecondaryActionButton from '../../shared/SecondaryActionButton'
import CounterField from '../../shared/CounterField'
import theme from '../../../theme'
import { convertTimestampToDateString } from '../../../shared/dateUtils'

const TitleCell = styled.div`
  align-items: center;
  background: transparent;
  display: flex;
  height: 45px;
  line-height: 1em;
`

const DurationDaysCell = styled.div`
  align-items: center;
  display: flex;
  height: 45px;
  justify-content: flex-start;
  position: relative;
`

const TaskPrimaryFieldsContainer = styled.div`
  display: flex;
`

const TaskRecipientsContainer = styled.div`
  margin-bottom: 20px;
`

const TaskSectionContainer = styled.div`
  border-bottom: 2px solid rgba(191, 191, 191, 0.5);
  padding: ${grid(5)} 0 ${grid(5)} 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const TaskTitle = styled.div`
  color: ${theme.colors.neutral.gray20};
  font-family: ${theme.fontInterface};
  font-size: ${theme.fontSizeBase};
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 19px;
  margin-bottom: 4px;
`

const BaseFieldContainer = styled.div`
  display: flex;
  flex-direction: column;

  & + div {
    margin-left: 20px;
  }
`

const TitleFieldContainer = styled(BaseFieldContainer)`
  flex: 1 1 34em;
`

const AssigneeFieldContainer = styled(BaseFieldContainer)`
  flex: 1 1 290px;
`

const DueDateFieldContainer = styled(BaseFieldContainer)`
  flex: 0 0 7.8em;
`

const TaskNotificationLogsContainer = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const NotificationLogsToggle = styled.button`
  background-color: transparent;
  border: none;
  color: ${theme.colorPrimary};
  font-size: ${theme.fontSizeBaseSmall};
  padding: 20px 10px;
  text-decoration: underline;
`

const NotificationLogs = styled.div`
  color: ${theme.colorPrimary};
  font-size: ${theme.fontSizeBaseSmall};
  margin: 10px 0;
  text-align: left;
`

const TaskActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TaskEditModal = ({
  task,
  updateTask,
  updateTaskNotification: persistTaskNotification,
  assigneeGroupedOptions,
  isReadOnly,
  editAsTemplate,
  dueDateLocalString,
  transposedEndOfToday,
  transposedDueDate,
  recipientGroupedOptions,
  deleteTaskNotification,
  displayDefaultDurationDays,
  createTaskEmailNotificationLog,
  notificationOptions,
  manuscript,
  currentUser,
  sendNotifyEmail,
  isOpen,
  onSave,
  onCancel,
}) => {
  const [taskEmailNotifications, setTaskNotifications] = useState(
    task.emailNotifications ?? [],
  )

  const [selectedDurationDays, setSelectedDurationDays] = useState(
    task.defaultDurationDays,
  )

  const [taskTitle, setTaskTitle] = useState(task?.title || '')

  const updateTaskTitleDebounce = useCallback(
    debounce(updateTask ?? (() => {}), 1000),
    [],
  )

  useEffect(() => {
    return updateTaskTitleDebounce.flush()
  }, [])

  const updateTaskTitle = value => {
    setTaskTitle(value)
    updateTaskTitleDebounce(task.id, { ...task, title: value })
  }

  useEffect(() => {
    if (!editAsTemplate) {
      setTaskNotifications(task.emailNotifications)
    }

    setTaskTitle(task.title)
  }, [task])

  const repackageTaskNotification = taskNotification => ({
    id: taskNotification.id,
    taskId: taskNotification.taskId,
    recipientUserId: taskNotification.recipientUserId || null,
    recipientType: taskNotification.recipientType || null,
    notificationElapsedDays: taskNotification.notificationElapsedDays || null,
    emailTemplateKey: taskNotification.emailTemplateKey || null,
    recipientName: taskNotification.recipientName || null,
    recipientEmail: taskNotification.recipientEmail || null,
  })

  const updateTaskNotification = async updatedTaskNotification => {
    const shouldPersistTaskNotification =
      (!editAsTemplate && updatedTaskNotification.recipientType) ||
      (editAsTemplate &&
        (updatedTaskNotification.recipientType ||
          updatedTaskNotification.emailTemplateKey))

    if (shouldPersistTaskNotification) {
      persistTaskNotification({
        variables: {
          taskNotification: repackageTaskNotification({
            ...updatedTaskNotification,
          }),
        },
      })
    } else if (
      editAsTemplate &&
      (task.emailNotifications ?? []).some(
        emailNotification =>
          emailNotification.id === updatedTaskNotification.id,
      )
    ) {
      // if updatedTaskNotification is in task.emailNotifications then it's
      // an existing task without valid recipient and email template and
      // it needs to be deleted. Else, it's a new task without valid
      // recipient and email template so no deletion required
      deleteTaskNotification({
        variables: { id: updatedTaskNotification.id },
      })
    }

    setTaskNotifications(currentTaskEmailNotifications =>
      currentTaskEmailNotifications.map(t =>
        t.id === updatedTaskNotification.id ? updatedTaskNotification : t,
      ),
    )
  }

  const addNewTaskNotification = () => {
    setTaskNotifications([
      ...(taskEmailNotifications ?? []),
      {
        id: uuid(),
        taskId: task.id,
        recipientType: null,
      },
    ])
  }

  const [isToggled, setToggled] = useState(false)

  const status = {
    NOT_STARTED: 'Not started',
    START: 'Start',
    IN_PROGRESS: 'In progress',
    PAUSED: 'Paused',
    DONE: 'Done',
  }

  return (
    <Modal
      contentStyles={{
        margin: 'auto',
        maxWidth: '1200px',
        minHeight: '480px',
        overflow: 'hidden',
        width: '90vw',
      }}
      isOpen={isOpen}
      onClose={() => onCancel(false)}
      rightActions={
        <ActionButton onClick={() => onSave(false)} primary>
          Save
        </ActionButton>
      }
      title="Task details"
    >
      <TaskSectionContainer>
        <TaskPrimaryFieldsContainer>
          <TitleFieldContainer>
            <TaskTitle>Task title</TaskTitle>
            <TitleCell>
              <TextInput
                autoFocus={!taskTitle}
                onChange={event => updateTaskTitle(event.target.value)}
                placeholder="Give your task a name..."
                value={taskTitle}
              />
            </TitleCell>
          </TitleFieldContainer>
          <AssigneeFieldContainer>
            <TaskTitle>Assignee</TaskTitle>
            <AssigneeDropdown
              assigneeGroupedOptions={assigneeGroupedOptions}
              task={task}
              unregisteredFieldsAlign="row"
              updateTask={updateTask}
            />
          </AssigneeFieldContainer>
          {!editAsTemplate && task && task.status !== status.NOT_STARTED ? (
            <DueDateFieldContainer>
              <TaskTitle>Due date</TaskTitle>
              <DueDateField
                displayDefaultDurationDays={displayDefaultDurationDays}
                dueDateLocalString={dueDateLocalString}
                position="bottom center"
                task={task}
                transposedDueDate={transposedDueDate}
                transposedEndOfToday={transposedEndOfToday}
                updateTask={updateTask}
              />
            </DueDateFieldContainer>
          ) : (
            <div>
              <TaskTitle>Duration in days</TaskTitle>
              <DurationDaysCell>
                <CounterField
                  minValue={0}
                  onChange={val => {
                    setSelectedDurationDays(val)
                    updateTask(task.id, {
                      ...task,
                      defaultDurationDays: val,
                    })
                  }}
                  showNone
                  value={task.defaultDurationDays}
                />
              </DurationDaysCell>
            </div>
          )}
        </TaskPrimaryFieldsContainer>
      </TaskSectionContainer>
      <TaskSectionContainer>
        <TaskRecipientsContainer>
          {taskEmailNotifications?.length ? (
            <>
              {taskEmailNotifications.map((notification, key) => (
                <TaskNotificationDetails
                  createTaskEmailNotificationLog={
                    createTaskEmailNotificationLog
                  }
                  currentUser={currentUser}
                  deleteTaskNotification={deleteTaskNotification}
                  editAsTemplate={editAsTemplate}
                  key={notification.id}
                  manuscript={manuscript}
                  notificationOptions={notificationOptions}
                  recipientGroupedOptions={recipientGroupedOptions}
                  selectedDurationDays={selectedDurationDays}
                  sendNotifyEmail={sendNotifyEmail}
                  task={task}
                  taskEmailNotification={notification}
                  updateTaskNotification={updateTaskNotification}
                />
              ))}
            </>
          ) : null}
        </TaskRecipientsContainer>
        <TaskActionContainer>
          {!isReadOnly && (
            <SecondaryActionButton
              disabled={
                !editAsTemplate && taskEmailNotifications?.length
                  ? taskEmailNotifications.some(
                      t => !t.recipientType && !t.emailTemplateKey,
                    )
                  : false
              }
              onClick={addNewTaskNotification}
              primary
            >
              Add Notification Recipient
            </SecondaryActionButton>
          )}
        </TaskActionContainer>
        {!editAsTemplate ? (
          task.notificationLogs &&
          task.notificationLogs.length !== 0 && (
            <TaskNotificationLogsContainer>
              <NotificationLogsToggle onClick={() => setToggled(!isToggled)}>
                {isToggled
                  ? `Hide all notifications sent (${task.notificationLogs?.length})`
                  : `Show all notifications sent (${task.notificationLogs?.length})`}
              </NotificationLogsToggle>
              {isToggled && (
                <NotificationLogs>
                  {task.notificationLogs.map(log => (
                    <>
                      <div>{convertTimestampToDateString(log.created)}</div>
                      <div>{log.content}</div>
                      <br />
                    </>
                  ))}
                </NotificationLogs>
              )}
            </TaskNotificationLogsContainer>
          )
        ) : (
          <></>
        )}
      </TaskSectionContainer>
    </Modal>
  )
}

TaskEditModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    assignee: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
    dueDate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    status: PropTypes.string.isRequired,
  }).isRequired,
  /** Callback for when a new task is abandoned before receiving a title (e.g. escape was pressed) */
  onCancel: PropTypes.func,
  updateTask: PropTypes.func.isRequired,
}
TaskEditModal.defaultProps = {
  onCancel: () => {},
}

export default TaskEditModal
