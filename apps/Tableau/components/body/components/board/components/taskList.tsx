import React from 'react'
import { Task } from '.prisma/client'
import { IFullStatus } from '../../../../../types/types'
import { TaskItemOrder } from './taskItemOrder'

interface ITaskListProps {
    tasks: Task[]
    status: IFullStatus
}

export function TaskList(props: ITaskListProps) {
    const { tasks, status } = props

    return (
        <>
            {[...tasks, undefined].map((task, idx) => {
                return (
                    <TaskItemOrder
                        key={task?.id ?? idx}
                        status={status}
                        task={task}
                    />
                )
            })}
        </>
    )
}
