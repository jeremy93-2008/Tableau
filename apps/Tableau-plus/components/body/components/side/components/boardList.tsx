import React from 'react'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { noop } from '@chakra-ui/utils'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { BoardEdit } from './boardEdit'
import { BoardDelete } from './boardDelete'

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
    onItemClick?: (board: IBoardWithAllRelation) => void
}

export function BoardList(props: IBoardListProps) {
    const [selectedBoard] = useAtom(BoardAtom)
    const { listOfBoards, onItemClick } = props
    return (
        <Flex flexDirection="column" pt={2}>
            {listOfBoards &&
                listOfBoards.map((board) => {
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
                                />
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
