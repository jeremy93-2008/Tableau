import React, { useCallback } from 'react'
import {
    Avatar,
    AvatarBadge,
    Flex,
    Image,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { noop } from '@chakra-ui/utils'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { BoardEdit } from './boardEdit'
import { BoardDelete } from './boardDelete'
import { useSession } from 'next-auth/react'
import { useBoardPermission } from '../hooks/useBoardPermission'
import { BoardItem } from './boardItem'

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
    onItemClick?: (board: IBoardWithAllRelation) => void
}

export function BoardList(props: IBoardListProps) {
    const { listOfBoards, onItemClick } = props

    const [selectedBoard] = useAtom(BoardAtom)

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
