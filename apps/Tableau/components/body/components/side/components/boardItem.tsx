import { Avatar, Flex, Image, Text, Tooltip } from '@chakra-ui/react'
import { noop } from '@chakra-ui/utils'
import { BoardEdit } from './boardEdit'
import { BoardDelete } from './boardDelete'
import React, { useCallback } from 'react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'
import { useBoardPermission } from '../hooks/useBoardPermission'
import { useThemeMode } from 'shared-hooks'

interface IBoardItemProps {
    board: IBoardWithAllRelation
    onItemClick?: (board: IBoardWithAllRelation) => void
}

export function BoardItem(props: IBoardItemProps) {
    const { board, onItemClick } = props
    const { bg, text } = useThemeMode()
    const [selectedBoard] = useAtom(BoardAtom)
    const { data: session } = useSession()

    const boardPermission = useBoardPermission(board)

    const getIsBoardOwner = useCallback(
        (board: IBoardWithAllRelation) => {
            if (!session || !session.user) return
            return session.user.email === board.user.email
        },
        [session]
    )

    const isCurrentUserBoardOwner = getIsBoardOwner(board)
    return (
        <Flex
            data-cy="boardItem"
            key={board.id}
            color={board.id === selectedBoard?.id ? 'white' : text.primary}
            bgColor={board.id === selectedBoard?.id ? 'teal.400' : bg.secondary}
            _hover={{
                bgColor:
                    board.id === selectedBoard?.id ? 'teal.500' : bg.tertiary,
            }}
            onClick={onItemClick ? () => onItemClick(board) : noop}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius={0}
            cursor="pointer"
            userSelect="none"
            px={4}
            py={4}
        >
            <Flex alignItems="center">
                <Avatar name={board.name} borderRadius="10px" mr={2}>
                    {!isCurrentUserBoardOwner && (
                        <Tooltip
                            label={`Board shared by ${board.user.name} (${board.user.email})`}
                        >
                            <Image
                                position="absolute"
                                top={7}
                                left={7}
                                boxSize="1.5em"
                                border="solid 2px teal"
                                alt="Board shared by User"
                                borderRadius="100%"
                                src={board.user.image!}
                                referrerPolicy="no-referrer"
                            />
                        </Tooltip>
                    )}
                </Avatar>
                <Text pl={1}>{board.name}</Text>
            </Flex>
            <Flex>
                <BoardEdit
                    isVisible={selectedBoard?.id === board.id}
                    isDisabled={!boardPermission?.edit ?? true}
                    singleBoard={board}
                />
                <BoardDelete
                    isVisible={selectedBoard?.id === board.id}
                    isDisabled={!boardPermission?.delete ?? true}
                    singleBoard={board}
                />
            </Flex>
        </Flex>
    )
}
