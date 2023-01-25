import React, { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { Container, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Task } from '.prisma/client'
import { ColumnNew } from './columnNew'
import { ColumnTaskNew } from './columnTaskNew'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { TaskList } from './taskList'
import { useDrop } from 'react-dnd'
import { TaskItemType } from '../../../../../constants/dragType'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '../../../../../constants/url'
import { ITaskEditFormikValues } from './taskEdit'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'
import { IFullStatus } from '../../../../../types/types'
import { ColumnTaskMove } from './columnTaskMove'

interface IColumnTaskProps {
    statusBoard?: IFullStatus
    newColumn?: boolean
}

export function ColumnTask(props: IColumnTaskProps) {
    const { statusBoard, newColumn } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isHoveringColumn, setHoveringColumn] = useState(false)

    const { mutateAsync } = useMutation((values: ITaskEditFormikValues) => {
        return axios.post(`${API_URL}/task/edit`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const onDropTaskItem = useCallback(
        ({ task }: { task: Task }) => {
            if (!statusBoard || !statusBoard.status.name) return
            mutateAsync({
                id: task.id,
                name: task.name,
                description: task.description || '',
                boardId: task.boardId,
                estimatedTime: task.estimatedTime || 0,
                elapsedTime: task.elapsedTime || 0,
                statusId: statusBoard.id,
            }).then(() => {
                refetchBoards.fetch()
            })
        },
        [statusBoard, mutateAsync, refetchBoards]
    )

    const [{ isOver }, drop] = useDrop(() => ({
        accept: TaskItemType,
        drop: onDropTaskItem,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const tasks = useMemo(() => {
        return selectedBoard?.Task.filter(
            (task) => task.statusId === statusBoard?.id
        )
    }, [selectedBoard, statusBoard])

    const onMouseEnterColumn = useCallback(() => {
        if (isHoveringColumn) return
        setHoveringColumn(true)
    }, [isHoveringColumn, setHoveringColumn])

    const onMouseLeaveColumn = useCallback(() => {
        if (!isHoveringColumn) return
        setHoveringColumn(false)
    }, [isHoveringColumn, setHoveringColumn])

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
            filter={`hue-rotate(${isOver ? '250deg' : '0deg'})`}
        >
            {!newColumn && statusBoard && (
                <>
                    <Flex justifyContent="space-between" mt={3} mb={4}>
                        <Text fontSize="16px" fontWeight="bold">
                            {statusBoard?.status.name}
                        </Text>
                        <Flex height={8}>
                            {isHoveringColumn && (
                                <ColumnTaskMove statusBoard={statusBoard} />
                            )}
                        </Flex>
                    </Flex>
                    {tasks && tasks.length > 0 && (
                        <VStack my={4}>
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
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                    />
                </Flex>
            )}
        </Container>
    )
}
