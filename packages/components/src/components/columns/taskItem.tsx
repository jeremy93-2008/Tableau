import React, { useCallback, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import {
    Avatar,
    Badge,
    Box,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { BsClock, BsClockHistory, BsFillPencilFill } from 'react-icons/bs'
import { TaskEdit } from './taskEdit'
import { TaskItemType } from 'shared-utils'
import { IFullStatus } from 'shared-types'
import { getAnimation } from 'shared-utils'
import { useHighlightTaskItem } from './hooks/useHighlightTaskItem'
import { noop } from '@chakra-ui/utils'
import { useTableauTaskHashUpdate } from './hooks/useTableauTaskHashUpdate'
import { useTableauRoute, useThemeMode } from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTask } from 'shared-types'
import { FaUserSlash } from 'react-icons/fa'

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

    const { border } = useThemeMode()

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
                    {task.tags.length > 0 && (
                        <Flex flexWrap="wrap">
                            {task.tags.map((tag) => (
                                <Tooltip
                                    key={tag.id}
                                    label={tag.name}
                                    aria-label={tag.name}
                                >
                                    <Badge
                                        data-cy="taskTag"
                                        mr={1}
                                        mb={1}
                                        variant="solid"
                                        backgroundColor={tag.color}
                                    >
                                        {tag.name}
                                    </Badge>
                                </Tooltip>
                            ))}
                        </Flex>
                    )}
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
                                data-cy="taskEdit"
                                onClick={() => onTaskEdit()}
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
                        onClose={() => {
                            onClose()
                            if (!selectedBoard) return
                            pushBoard(selectedBoard)
                        }}
                        task={task}
                        status={status!}
                    />
                )}
            </Flex>
            <Flex
                position="absolute"
                right={-2}
                bottom={-2}
                className="board-item-actions"
            >
                {task.assignedUsers?.map(
                    (assignedUser, idx, assignedUsersArray) => {
                        if (idx === 2)
                            return (
                                <Tooltip
                                    key={assignedUser.id + idx}
                                    label={assignedUsersArray
                                        .slice(2)
                                        .map((assigned) => assigned.User.name)
                                        .join(', ')}
                                >
                                    <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        bgColor="gray.500"
                                        borderRadius="50%"
                                        width="32px"
                                        height="32px"
                                        ml={-3}
                                        _hover={{
                                            ml: 0,
                                        }}
                                    >
                                        <Text fontSize="xs">
                                            +{assignedUsersArray?.length - 2}
                                        </Text>
                                    </Flex>
                                </Tooltip>
                            )
                        if (idx > 1) return <></>
                        return (
                            <Tooltip
                                key={assignedUser.id + idx}
                                label={`${assignedUser.User.name} (${assignedUser.User.email})`}
                            >
                                <Avatar
                                    name={assignedUser.User.name ?? ''}
                                    src={assignedUser.User.image ?? ''}
                                    ml={idx > 0 ? -3 : 0}
                                    border="2px teal solid"
                                    zIndex={assignedUsersArray?.length - idx}
                                    width="36px"
                                    height="36px"
                                    _hover={{
                                        ml: 0,
                                    }}
                                />
                            </Tooltip>
                        )
                    }
                )}
                {task.assignedUsers?.length === 0 && (
                    <Tooltip label="No user assigned">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            bgColor="gray.400"
                            border="2px teal solid"
                            borderRadius="50%"
                            width="36px"
                            height="36px"
                        >
                            <FaUserSlash />
                        </Flex>
                    </Tooltip>
                )}
            </Flex>
        </Flex>
    )
}
