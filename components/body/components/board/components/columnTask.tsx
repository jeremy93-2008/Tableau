import React, { useCallback, useMemo, useState } from 'react'
import { Container, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Status } from '.prisma/client'
import { ColumnNew } from './columnNew'
import { ColumnTaskNew } from './columnTaskNew'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { TaskList } from './taskList'

interface IColumnTaskProps {
    status?: Status
    newColumn?: boolean
}

export function ColumnTask(props: IColumnTaskProps) {
    const { status, newColumn } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isHoveringColumn, setHoveringColumn] = useState(false)

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
