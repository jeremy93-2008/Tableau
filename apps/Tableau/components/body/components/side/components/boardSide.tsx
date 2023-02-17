import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { Flex, Text } from '@chakra-ui/react'
import { BoardList } from './boardList'
import { BoardNew } from './boardNew'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { useTableauQuery } from 'shared-hooks'

export function BoardSide() {
    const { data: session } = useSession()
    const [selectedBoard, setBoard] = useAtom(BoardAtom)

    const [_refetchBoards, setRefetchBoard] = useAtom(RefetchBoardAtom)

    const { data, refetch, isRefetching } = useTableauQuery<
        IBoardWithAllRelation[]
    >(['api/board/list'], {
        enabled: !!session,
        refetchInterval: 6000,
    })

    const onAfterSubmit = useCallback(() => {
        refetch().then()
    }, [refetch])

    const onItemClick = useCallback(
        (board: IBoardWithAllRelation) => {
            if (selectedBoard?.id === board.id) return
            setBoard(board)
            setRefetchBoard({ fetch: onAfterSubmit })
        },
        [selectedBoard, setBoard, setRefetchBoard, onAfterSubmit]
    )

    useEffect(() => {
        if (!data) return
        const updatedSelectedBoard = data.find(
            (d) => d.id === selectedBoard?.id
        )
        if (!updatedSelectedBoard) return
        setBoard(updatedSelectedBoard)
    }, [selectedBoard, data, setBoard])

    return (
        <Flex flexDirection="column" width="100%">
            <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2}
            >
                <Flex>
                    <Text fontWeight="bold" py={2}>
                        Your boards
                    </Text>
                </Flex>
                <Flex>
                    <BoardNew boards={data} onAfterSubmit={onAfterSubmit} />
                </Flex>
            </Flex>
            {session && (
                <BoardList listOfBoards={data} onItemClick={onItemClick} />
            )}
        </Flex>
    )
}
