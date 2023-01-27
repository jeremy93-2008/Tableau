import axios from 'axios'
import { Task } from '.prisma/client'
import { IFullStatus } from '../../../../../types/types'
import { TaskItem } from './taskItem'
import React, { useCallback, useMemo, useState } from 'react'
import { useDrop } from 'react-dnd'
import { TaskItemType } from '../../../../../constants/dragType'
import { Box, Flex } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { useReorderTasks } from '../../../../../hooks/useReorderTasks'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface ITaskItemWithOrderingProps {
    task?: Task
    status: IFullStatus
}

export function TaskItemOrder(props: ITaskItemWithOrderingProps) {
    const { task: currentTask, status } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoard] = useAtom(RefetchBoardAtom)
    const [isCurrentColumnDropped, setIsCurrentColumnDropped] = useState(false)

    const { mutateAsync } = useTableauMutation((values: Task[]) => {
        return axios.post(`api/tasks/order`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const orderedTasks = useMemo(() => {
        return selectedBoard?.Task.filter(
            (task) => task.statusId === status?.id
        ).sort((a, b) => a.order - b.order)
    }, [selectedBoard, status])

    const { reorderTasks } = useReorderTasks(orderedTasks, currentTask)

    const onDropTaskItem = useCallback(
        ({ task: nextTask }: { task: Task }) => {
            if (nextTask.statusId !== status.id) return
            const newOrderedTasks = reorderTasks(nextTask)
            if (!newOrderedTasks) return
            mutateAsync(newOrderedTasks).then(() => {
                setIsCurrentColumnDropped(false)
                refetchBoard.fetch()
            })
        },
        [reorderTasks, mutateAsync, refetchBoard, status]
    )

    const onDropHoverItem = useCallback(
        ({ task }: { task: Task }) => {
            if (task.statusId === status.id)
                return setIsCurrentColumnDropped(true)
            setIsCurrentColumnDropped(false)
        },
        [status, setIsCurrentColumnDropped]
    )

    const [{ isOver }, drop] = useDrop(() => ({
        accept: TaskItemType,
        hover: onDropHoverItem,
        drop: onDropTaskItem,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    return (
        <Flex
            ref={drop}
            flexDirection="column"
            alignItems="center"
            flex={1}
            minH={'12px'}
            width="100%"
        >
            {isCurrentColumnDropped && (isOver || !currentTask) && (
                <Flex justifyContent="center" width="100%" pb={3} pt={2}>
                    {isCurrentColumnDropped && isOver && (
                        <Box
                            bgGradient="linear(to-t, yellow.200, yellow.300)"
                            width="90%"
                            height={1}
                            borderRadius={2}
                        />
                    )}
                </Flex>
            )}
            {currentTask && (
                <TaskItem
                    key={currentTask.id}
                    status={status}
                    task={currentTask}
                />
            )}
        </Flex>
    )
}
