import React, { useCallback, useState } from 'react'
import { useDrag } from 'react-dnd'
import {
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { BsClock, BsClockHistory, BsFillPencilFill } from 'react-icons/bs'
import { Task } from '.prisma/client'
import { TaskEdit } from './taskEdit'
import { TaskItemType } from '../../../../../constants/dragType'
import { IFullStatus } from '../../../../../types/types'

interface ITaskItemProps {
    task: Task
    status: IFullStatus
}

export function TaskItem(props: ITaskItemProps) {
    const { task, status } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isHoveringTask, setHoveringTask] = useState(false)

    const [{ isDragging }, drag] = useDrag(() => ({
        type: TaskItemType,
        item: { task },
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

    return (
        <Flex
            ref={drag}
            className="board-item-container"
            bgColor="teal.600"
            pl={4}
            borderRadius={10}
            width="100%"
            onMouseEnter={onMouseEnterTask}
            onMouseLeave={onMouseLeaveTask}
            cursor="move"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <Flex
                className="board-item-info"
                flex={1}
                flexDirection="column"
                py={2}
            >
                <Text minHeight="65px">
                    <Text fontWeight="bold">{task.name}</Text>
                    <Text fontSize="13px">{task.description}</Text>
                </Text>
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
                <Tooltip label="Edit current Task">
                    <IconButton
                        onClick={() => onOpen()}
                        colorScheme="teal"
                        bgColor="teal.600"
                        _hover={{
                            bgColor: 'teal.500',
                        }}
                        borderRadius="100%"
                        aria-label="Edit current Task"
                        icon={<BsFillPencilFill />}
                        style={{
                            opacity: isHoveringTask ? '1' : '0',
                        }}
                    />
                </Tooltip>
                {isOpen && (
                    <TaskEdit
                        isOpen={isOpen}
                        onClose={onClose}
                        task={task}
                        status={status}
                    />
                )}
            </Flex>
        </Flex>
    )
}
