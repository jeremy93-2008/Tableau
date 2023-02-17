import React, { useCallback, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import {
    Box,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { BsClock, BsClockHistory, BsFillPencilFill } from 'react-icons/bs'
import { Task } from '.prisma/client'
import { TaskEdit } from './taskEdit'
import { TaskItemType } from 'shared-utils'
import { IFullStatus } from '../../types/types'
import { getAnimation } from 'shared-utils'
import { useHighlightTaskItem } from './hooks/useHighlightTaskItem'
import { noop } from '@chakra-ui/utils'

interface ITaskItemProps {
    task: Task
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

    const taskContainer = useRef<HTMLDivElement>()
    const { bounceAnimation } = getAnimation()

    const { isCurrentTaskHighlighted } = useHighlightTaskItem(
        taskContainer,
        task,
        readonly,
        noHighlightIt
    )

    const [{ isDragging }, drag] = useDrag(() => ({
        type: TaskItemType,
        item: { task },
        canDrag: !readonly || !isDisabled,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    const onMouseEnterTask = useCallback(() => {
        if (isHoveringTask) return
        setHoveringTask(true)
    }, [isHoveringTask, setHoveringTask])

    const onMouseLeaveTask = useCallback(() => {
        if (!isHoveringTask) return
        setHoveringTask(false)
    }, [isHoveringTask, setHoveringTask])

    const handleRefTaskContainer = (element: HTMLDivElement) => {
        isDisabled ? noop() : drag(element)
        taskContainer.current = element
    }

    return (
        <Flex
            ref={handleRefTaskContainer}
            className="board-item-container"
            bgColor={isCurrentTaskHighlighted ? 'yellow.400' : 'teal.600'}
            color={isCurrentTaskHighlighted ? 'black' : 'gray.100'}
            pl={4}
            borderRadius={10}
            width="100%"
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
                    <Tooltip label={task.name}>
                        <Text noOfLines={1} fontWeight="bold">
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
            <Flex
                mt="-8px"
                mr="-8px"
                justifyContent="right"
                className="board-item-actions"
            >
                {!readonly && (
                    <Tooltip label="Edit current Task">
                        {
                            <IconButton
                                onClick={() => onOpen()}
                                colorScheme="teal"
                                isDisabled={isDisabled}
                                bgColor="teal.600"
                                _hover={{
                                    bgColor: isDisabled
                                        ? 'teal.600'
                                        : 'teal.500',
                                }}
                                borderRadius="100%"
                                aria-label="Edit current Task"
                                icon={<BsFillPencilFill />}
                                style={{
                                    opacity: isHoveringTask ? '1' : '0',
                                }}
                            />
                        }
                    </Tooltip>
                )}
                {isOpen && (
                    <TaskEdit
                        isOpen={isOpen}
                        onClose={onClose}
                        task={task}
                        status={status!}
                    />
                )}
            </Flex>
        </Flex>
    )
}
