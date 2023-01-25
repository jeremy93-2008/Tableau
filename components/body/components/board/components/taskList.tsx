import React from 'react'
import { Task } from '.prisma/client'
import { TaskItem } from './taskItem'
import { IFullStatus } from '../../../../../types/types'

interface ITaskListProps {
    tasks: Task[]
    status: IFullStatus
}

export function TaskList(props: ITaskListProps) {
    const { tasks, status } = props
    return (
        <>
            {tasks.map((task) => {
                return <TaskItem key={task.id} status={status} task={task} />
            })}
        </>
    )
}
