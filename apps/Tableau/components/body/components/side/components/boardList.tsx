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

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
    onItemClick?: (board: IBoardWithAllRelation) => void
}

export function BoardList(props: IBoardListProps) {
    const { data: session } = useSession()

    const [selectedBoard] = useAtom(BoardAtom)
    const { listOfBoards, onItemClick } = props

    const getIsBoardOwner = useCallback(
        (board: IBoardWithAllRelation) => {
            if (!session || !session.user) return
            return session.user.email === board.user.email
        },
        [session]
    )

    return (
        <Flex flexDirection="column" pt={2}>
            {listOfBoards &&
                listOfBoards.map((board) => {
                    const isCurrentUserBoardOwner = getIsBoardOwner(board)
                    return (
                        <Flex
                            key={board.id}
                            color={
                                board.id === selectedBoard?.id
                                    ? 'white'
                                    : 'gray.700'
                            }
                            bgColor={
                                board.id === selectedBoard?.id
                                    ? 'teal.400'
                                    : 'gray.100'
                            }
                            _hover={{
                                bgColor:
                                    board.id === selectedBoard?.id
                                        ? 'teal.500'
                                        : 'gray.200',
                            }}
                            onClick={
                                onItemClick ? () => onItemClick(board) : noop
                            }
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
                                <Avatar
                                    name={board.name}
                                    src="https://bit.ly/broken-link"
                                    borderRadius="10px"
                                    mr={2}
                                >
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
                                    singleBoard={board}
                                />
                                <BoardDelete
                                    isVisible={selectedBoard?.id === board.id}
                                    singleBoard={board}
                                />
                            </Flex>
                        </Flex>
                    )
                })}
        </Flex>
    )
}
