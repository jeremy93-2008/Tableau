import React from 'react'
import { IFullStatus, IFullTask } from 'shared-types'
import { TaskItemOrder } from './taskItemOrder'
import { useTaskPermission } from './hooks/useTaskPermission'

interface ITaskListProps {
    tasks: IFullTask[]
    status: IFullStatus
}

export function TaskList(props: ITaskListProps) {
    const { tasks, status } = props
    const taskPermission = useTaskPermission()
    return (
        <>
            {[...tasks, undefined].map((task, idx) => {
                return (
                    <TaskItemOrder
                        key={task?.id ?? idx}
                        status={status}
                        task={task}
                        isDisabled={!taskPermission?.edit ?? true}
                    />
                )
            })}
        </>
    )
}
