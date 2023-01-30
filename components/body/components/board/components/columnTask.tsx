import React, {
    MutableRefObject,
    useCallback,
    useMemo,
    useRef,
    useState,
    WheelEvent,
} from 'react'
import axios from 'axios'
import {
    Container,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { Task } from '.prisma/client'
import { ColumnNew } from './columnNew'
import { ColumnTaskNew } from './columnTaskNew'
import { useAtom } from 'jotai'
import { TaskList } from './taskList'
import { useDrop } from 'react-dnd'
import { TaskItemType } from '../../../../../constants/dragType'
import { ITaskEditFormikValues } from './taskEdit'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'
import { IBoardWithAllRelation, IFullStatus } from '../../../../../types/types'
import { ColumnTaskMove } from './columnTaskMove'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'
import { BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from '../../modal/deleteModal'
import { getScrollbarStyle } from '../../../../../utils/getScrollbarStyle'

interface IColumnTaskProps {
    selectedBoard: IBoardWithAllRelation
    statusBoard?: IFullStatus
    newColumn?: boolean
}

export function ColumnTask(props: IColumnTaskProps) {
    const { selectedBoard, statusBoard, newColumn } = props
    const refColumnStack = useRef<HTMLDivElement>()
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const {
        isOpen: isColumnNewOpen,
        onOpen: onOpenColumnNew,
        onClose: onCloseColumnNew,
    } = useDisclosure()

    const {
        isOpen: isColumnDeleteOpen,
        onOpen: onOpenColumnDelete,
        onClose: onCloseColumnDelete,
    } = useDisclosure()

    const [isHoveringColumn, setHoveringColumn] = useState(false)
    const [isDropColumnAllowed, setDropColumnAllowed] = useState(false)

    const tasks = useMemo(() => {
        return selectedBoard?.Task.filter(
            (task) => task.statusId === statusBoard?.id
        ).sort((a, b) => a.order - b.order)
    }, [selectedBoard, statusBoard])

    const taskLength = useMemo(() => {
        return tasks?.length
    }, [tasks])

    const { mutateAsync: mutateColumnDeleteAsync } = useTableauMutation(
        (values: IFullStatus) => {
            return axios.post(
                `api/column/delete`,
                { id: values.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            )
        }
    )

    const onDeleteColumn = useCallback(
        (column: IFullStatus) => {
            mutateColumnDeleteAsync(column).then(() => {
                onCloseColumnDelete()
                refetchBoards.fetch()
            })
        },
        [mutateColumnDeleteAsync, onCloseColumnDelete, refetchBoards]
    )

    const { mutateAsync: mutateTaskEditAsync } = useTableauMutation(
        (values: ITaskEditFormikValues) => {
            return axios.post(`api/task/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onDropTaskItem = useCallback(
        ({ task }: { task: Task }) => {
            if (!statusBoard || !statusBoard.status.name) return
            if (statusBoard.id === task.statusId) return
            mutateTaskEditAsync({
                id: task.id,
                name: task.name,
                description: task.description || '',
                boardId: task.boardId,
                estimatedTime: task.estimatedTime || 0,
                elapsedTime: task.elapsedTime || 0,
                statusId: statusBoard.id,
                order: (taskLength ?? 998) + 1,
            }).then(() => {
                setDropColumnAllowed(false)
                refetchBoards.fetch()
            })
        },
        [statusBoard, mutateTaskEditAsync, refetchBoards, taskLength]
    )

    const onDropHoverItem = useCallback(
        ({ task }: { task: Task }) => {
            if (!statusBoard || !statusBoard.status.name) return
            if (statusBoard.id === task.statusId) return
            setDropColumnAllowed(true)
        },
        [statusBoard]
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

    const onMouseEnterColumn = useCallback(() => {
        if (isHoveringColumn) return
        setHoveringColumn(true)
    }, [isHoveringColumn, setHoveringColumn])

    const onMouseLeaveColumn = useCallback(() => {
        if (!isHoveringColumn) return
        setHoveringColumn(false)
    }, [isHoveringColumn, setHoveringColumn])

    const handleWheelColumnScroll = useCallback(
        (evt: WheelEvent<HTMLDivElement>) => {
            if (!refColumnStack.current) return
            if (
                refColumnStack.current?.clientHeight ===
                refColumnStack.current?.scrollHeight
            )
                return
            evt.stopPropagation()
        },
        [refColumnStack]
    )

    return (
        <Container
            ref={drop}
            role={'Dustbin'}
            bgColor={newColumn ? '#38B2AC99' : 'teal.400'}
            color="gray.100"
            borderRadius={10}
            flexDirection="column"
            minW={280}
            w={280}
            mr={4}
            ml={2}
            onMouseEnter={onMouseEnterColumn}
            onMouseLeave={onMouseLeaveColumn}
            filter={`hue-rotate(${
                isDropColumnAllowed && isOver ? '250deg' : '0deg'
            })`}
        >
            {!newColumn && statusBoard && (
                <>
                    <DeleteModal
                        title="Delete Column"
                        isOpen={isColumnDeleteOpen}
                        onClose={onCloseColumnDelete}
                        onSubmit={() => {
                            onDeleteColumn(statusBoard)
                        }}
                    />
                    <Flex justifyContent="space-between" mt={3} mb={4}>
                        <Flex flex={1} alignItems="center">
                            {isHoveringColumn && (
                                <Tooltip label="Delete this column">
                                    <IconButton
                                        onClick={() => onOpenColumnDelete()}
                                        aria-label={'Delete this column'}
                                        colorScheme="teal"
                                        _hover={{
                                            bgColor: 'red.500',
                                        }}
                                        size="sm"
                                        icon={<BsTrashFill />}
                                    />
                                </Tooltip>
                            )}
                            <Text
                                justifySelf="center"
                                fontSize="16px"
                                fontWeight="bold"
                                ml={3}
                            >
                                {statusBoard?.status.name}
                            </Text>
                        </Flex>
                        <Flex height={8}>
                            {isHoveringColumn && (
                                <ColumnTaskMove statusBoard={statusBoard} />
                            )}
                        </Flex>
                    </Flex>
                    {tasks && tasks.length > 0 && (
                        <VStack
                            ref={
                                refColumnStack as MutableRefObject<HTMLDivElement>
                            }
                            onWheel={handleWheelColumnScroll}
                            maxHeight="calc(100vh - 340px)"
                            overflowY="hidden"
                            overflowX="hidden"
                            pt={'10px'}
                            px={'8px'}
                            mt={4}
                            _hover={{
                                overflowY: 'auto',
                            }}
                            {...getScrollbarStyle()}
                        >
                            <TaskList tasks={tasks} status={statusBoard} />
                        </VStack>
                    )}
                    <ColumnTaskNew
                        isVisible={isHoveringColumn}
                        status={statusBoard}
                    />
                </>
            )}
            {newColumn && (
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    h="100%"
                >
                    <ColumnNew
                        isOpen={isColumnNewOpen}
                        onOpen={onOpenColumnNew}
                        onClose={onCloseColumnNew}
                    />
                </Flex>
            )}
        </Container>
    )
}
