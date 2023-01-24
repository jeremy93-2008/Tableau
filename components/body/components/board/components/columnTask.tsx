import React, { useCallback, useMemo, useState } from 'react'
import { Container, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Status, Task } from '.prisma/client'
import { ColumnNew } from './columnNew'
import { ColumnTaskNew } from './columnTaskNew'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { TaskList } from './taskList'
import { useDrop } from 'react-dnd'
import { TaskItemType } from '../../../../../constants/dragType'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from '../../../../../constants/url'
import { ITaskEditFormikValues } from './taskEdit'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface IColumnTaskProps {
    status?: Status
    newColumn?: boolean
}

export function ColumnTask(props: IColumnTaskProps) {
    const { status, newColumn } = props
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
            if (!status || !status.name) return
            mutateAsync({
                id: task.id,
                name: task.name,
                description: task.description || '',
                boardId: task.boardId,
                estimatedTime: task.estimatedTime || 0,
                elapsedTime: task.elapsedTime || 0,
                statusName: status.name,
            }).then(() => {
                refetchBoards.fetch()
            })
        },
        [status, mutateAsync, refetchBoards]
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
            (task) => task.statusId === status?.id
        )
    }, [selectedBoard, status])

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
            {!newColumn && status && (
                <>
                    <Text mt={3} mb={4} fontSize="16px" fontWeight="bold">
                        {status?.name}
                    </Text>
                    {tasks && tasks.length > 0 && (
                        <VStack my={4}>
                            <TaskList tasks={tasks} status={status} />
                        </VStack>
                    )}
                    <ColumnTaskNew
                        isVisible={isHoveringColumn}
                        status={status}
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
