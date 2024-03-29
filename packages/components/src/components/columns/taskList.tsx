import React from 'react'
import { Task } from '.prisma/client'
import { IFullStatus } from '../../types/types'
import { TaskItemOrder } from './taskItemOrder'
import { useTaskPermission } from './hooks/useTaskPermission'

interface ITaskListProps {
    tasks: Task[]
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
