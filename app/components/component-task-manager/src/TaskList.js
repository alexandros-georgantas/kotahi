import React, { useState, useContext, useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'
import moment from 'moment-timezone'
import Task from './Task'
import { RoundIconButton, TightColumn, MediumColumn } from '../../shared'
import { ConfigContext } from '../../config/src'
import styled from 'styled-components'

const TaskListContainer = styled.div`
  -webkit-font-smoothing: antialiased;
`
const AddTaskContainer = styled.div`
  padding: 0 8px;
`

const TaskList = ({
  editAsTemplate,
  tasks: persistedTasks,
  manuscriptId,
  users,
  roles,
  updateTask: persistTask,
  updateTasks: persistTasks,
  isReadOnly,
  updateTaskNotification,
  deleteTaskNotification,
}) => {
  const config = useContext(ConfigContext)

  // The tasks we keep in state may contain an extra task that hasn't yet received a title.
  // This is treated as temporary and not persisted until it has a title.
  const [tasks, setTasks] = useState(persistedTasks)

  useEffect(() => {
    setTasks(
      // Reorder required, as optimisticResponse doesn't honour array order, causing jitter with drag-n-drop
      [...persistedTasks].sort((a, b) => a.sequenceIndex - b.sequenceIndex),
    )
  }, [persistedTasks])

  const repackageTask = task => ({
    id: task.id,
    manuscriptId,
    title: task.title,
    assigneeUserId: task.assignee?.id || null,
    defaultDurationDays: task.defaultDurationDays || "None",
    reminderPeriodDays: task.reminderPeriodDays || 0,
    dueDate: editAsTemplate ? null : new Date(task.dueDate),
    status: editAsTemplate ? 'Not started' : task.status,
    assigneeType: task.assigneeType || null,
    assigneeName: task.assigneeName || null,
    assigneeEmail: task.assigneeEmail || null,
  })

  const updateTask = (id, updatedTask) => {
    if (updatedTask.title) {
      persistTask({
        variables: {
          task: repackageTask({ ...updatedTask, id }),
        },
      })
    }

    setTasks(tasks.map(t => (t.id === id ? updatedTask : t)))
  }

  const addNewTask = () => {
    const today = moment.tz(config.teamTimezone).endOf('day').toDate()

    setTasks([
      ...tasks,
      {
        id: uuid(),
        title: '',
        assignee: null,
        dueDate: today,
        status: 'Not started',
      },
    ])
  }

  const updateTasks = updatedTasks => {
    const tasksToPersist = updatedTasks
      .filter(t => t.title)
      .map(t => repackageTask(t))

    persistTasks({
      variables: {
        manuscriptId,
        tasks: tasksToPersist,
      },
    })
    setTasks(updatedTasks)
  }

  const onDragEnd = item => {
    if (!item.destination) return // dropped outside the list
    const result = tasks.filter((x, i) => i !== item.source.index)
    result.splice(item.destination.index, 0, tasks[item.source.index])
    updateTasks(result)
  }

  const userOptions = users.map(u => ({
    label: u.username,
    value: u.id,
    user: u,
    key: 'registeredUser',
  }))

  const userRoles = roles.map(role => ({
    label: role.name,
    value: role.slug,
    key: 'userRole',
  }))

  const assigneeGroupedOptions = [
    {
      options: [
        {
          label: 'Unregistered User',
          value: 'unregisteredUser',
          key: 'unregisteredUser',
        },
      ],
    },
    {
      label: 'User Roles',
      options: userRoles,
    },

    {
      label: 'Registered Users',
      options: userOptions,
    },
  ]

  const recipientGroupedOptions = [
    {
      options: [
        {
          label: 'Unregistered User',
          value: 'unregisteredUser',
          key: 'unregisteredUser',
        },
      ],
    },
    {
      options: [{ label: 'Assignee', value: 'assignee', key: 'assignee' }],
    },
    {
      label: 'User Roles',
      options: userRoles,
    },
    {
      label: 'Registered Users',
      options: userOptions,
    },
  ]

  if (editAsTemplate) {
    assigneeGroupedOptions.shift()
    recipientGroupedOptions.shift()
  }

  return (
    <TaskListContainer>
      <MediumColumn>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <TightColumn {...provided.droppableProps} ref={provided.innerRef}>
                {!tasks.length && 'Add your first task...'}
                {tasks.length ? (
                  <>
                    {tasks.map((task, index) => (
                      <Task
                        assigneeGroupedOptions={assigneeGroupedOptions}
                        deleteTaskNotification={deleteTaskNotification}
                        editAsTemplate={editAsTemplate}
                        index={index}
                        isReadOnly={isReadOnly}
                        key={task.id}
                        onCancel={() => updateTasks(tasks.filter(t => t.title))}
                        onDelete={id =>
                          updateTasks(tasks.filter(t => t.id !== id))
                        }
                        recipientGroupedOptions={recipientGroupedOptions}
                        task={task}
                        updateTask={updateTask}
                        updateTaskNotification={updateTaskNotification}
                      />
                    ))}
                  </>
                ) : null}
                {provided.placeholder}
              </TightColumn>
            )}
          </Droppable>
        </DragDropContext>
        {!isReadOnly && (
          <AddTaskContainer>
            <RoundIconButton
              disabled={tasks.some(t => !t.title)}
              iconName="Plus"
              onClick={addNewTask}
              primary
              title="Add a new task"
            />
          </AddTaskContainer>
        )}
      </MediumColumn>
    </TaskListContainer>
  )
}

export default TaskList
