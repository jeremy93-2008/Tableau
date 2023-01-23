import React from 'react'
import { Status, Task } from '.prisma/client'
import { TaskItem } from './taskItem'

interface ITaskListProps {
    tasks: Task[]
    status: Status
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
