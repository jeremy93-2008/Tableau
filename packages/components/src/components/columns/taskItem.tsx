import React, { useCallback, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Box, Flex, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { BsClock, BsClockHistory } from 'react-icons/bs'
import { TaskItemType } from 'shared-utils'
import { IFullStatus } from 'shared-types'
import { getAnimation } from 'shared-utils'
import { useHighlightTaskItem } from './hooks/useHighlightTaskItem'
import { noop } from '@chakra-ui/utils'
import { useTableauTaskHashUpdate } from './hooks/useTableauTaskHashUpdate'
import { useTableauRoute } from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTask } from 'shared-types'
import { getDateString } from './components/taskEditForm/utils/getDateString'
import { TaskItemTags } from './components/taskItem/taskItemTags'
import { TaskItemAssignedUser } from './components/taskItem/taskItemAssignedUser'
import { TaskItemEditTaskButton } from './components/taskItem/taskItemEditTaskButton'
import { TaskItemStartDueDate } from './components/taskItem/taskItemStartDueDate'

interface ITaskItemProps {
    task: IFullTask
    status?: IFullStatus
    readonly?: boolean
    noHighlightIt?: boolean
    isDisabled?: boolean
    style?: React.CSSProperties
}

export function TaskItem(props: ITaskItemProps) {
    const { task, status, isDisabled, readonly, noHighlightIt, style } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isHoveringTask, setHoveringTask] = useState(false)

    const [selectedBoard] = useAtom(BoardAtom)

    const taskContainer = useRef<HTMLDivElement>()

    const { bounceAnimation } = getAnimation()

    const { isCurrentTaskHighlighted } = useHighlightTaskItem(
        taskContainer,
        task,
        readonly,
        noHighlightIt
    )

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: TaskItemType,
            item: { task },
            canDrag: !readonly || !isDisabled,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
                handlerId: monitor.getHandlerId(),
            }),
        }),
        [task, readonly, isDisabled]
    )

    const onMouseEnterTask = useCallback(() => {
        if (isHoveringTask) return
        setHoveringTask(true)
    }, [isHoveringTask, setHoveringTask])

    const onMouseLeaveTask = useCallback(() => {
        if (!isHoveringTask) return
        setHoveringTask(false)
    }, [isHoveringTask, setHoveringTask])

    const { pushBoard, pushTask } = useTableauRoute()

    const onTaskEdit = useCallback(
        (routeToPush?: 'no-push') => {
            if (routeToPush === 'no-push') return onOpen()
            pushTask(task)
        },
        [onOpen, pushTask, task]
    )

    const handleRefTaskContainer = (element: HTMLDivElement) => {
        isDisabled ? noop() : drag(element)
        taskContainer.current = element
    }

    useTableauTaskHashUpdate(task, readonly, onTaskEdit, () => onClose())

    return (
        <Flex
            ref={handleRefTaskContainer}
            position="relative"
            className="board-item-container"
            bgColor={isCurrentTaskHighlighted ? 'yellow.400' : 'teal.600'}
            color={isCurrentTaskHighlighted ? 'black' : 'gray.100'}
            pl={4}
            borderRadius={10}
            width="100%"
            mb="8px"
            pr={readonly ? 3 : 0}
            onMouseEnter={onMouseEnterTask}
            onMouseLeave={onMouseLeaveTask}
            cursor={readonly || isDisabled ? 'inherit' : 'move'}
            animation={isCurrentTaskHighlighted ? bounceAnimation : ''}
            style={{ opacity: isDragging ? 0.5 : 1, ...style }}
        >
            <Flex
                className="board-item-info"
                flex={1}
                flexDirection="column"
                py={2}
            >
                <Box minHeight="65px">
                    <TaskItemTags task={task} />
                    <TaskItemStartDueDate task={task} />
                    <Tooltip label={task.name}>
                        <Text
                            data-cy="taskTitle"
                            noOfLines={1}
                            fontWeight="bold"
                        >
                            {task.name}
                        </Text>
                    </Tooltip>
                    <Tooltip label={task.description}>
                        <Text noOfLines={2} fontSize="13px">
                            {task.description}
                        </Text>
                    </Tooltip>
                </Box>
                <Flex className="board-item-clock" mt={2} justifyContent="left">
                    <Flex alignItems="center">
                        <BsClockHistory size={13} />
                        <Text ml={1}>{task.elapsedTime}</Text>
                    </Flex>
                    <Flex ml={3} alignItems="center">
                        <BsClock size={13} />
                        <Text ml={1}>{task.estimatedTime}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <TaskItemEditTaskButton
                task={task}
                status={status}
                readonly={readonly}
                onTaskEdit={onTaskEdit}
                isHoveringTask={isHoveringTask}
                taskEdit={{
                    isOpen,
                    onClose: () => {
                        onClose()
                        if (!selectedBoard) return
                        pushBoard(selectedBoard)
                    },
                }}
            />
            <TaskItemAssignedUser task={task} />
        </Flex>
    )
}
