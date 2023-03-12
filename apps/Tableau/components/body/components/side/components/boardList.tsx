import React from 'react'
import { Flex } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { BoardItem } from './boardItem'

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
    onItemClick?: (board: IBoardWithAllRelation, noPush?: boolean) => void
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
