import React, { useCallback } from 'react'
import { Flex } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { BoardItem } from './boardItem'

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
    onItemClick?: (board: IBoardWithAllRelation) => void
}

export function BoardList(props: IBoardListProps) {
    const { listOfBoards, onItemClick } = props

    return (
        <Flex flexDirection="column" pt={2}>
            {listOfBoards &&
                listOfBoards.map((board) => {
                    return (
                        <BoardItem
                            key={board.id}
                            board={board}
                            onItemClick={onItemClick}
                        />
                    )
                })}
        </Flex>
    )
}
