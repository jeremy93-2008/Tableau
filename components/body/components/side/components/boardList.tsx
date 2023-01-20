import React from 'react'
import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { noop } from '@chakra-ui/utils'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'

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
                        <Button
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
                            leftIcon={
                                <Avatar
                                    name={board.name}
                                    src="https://bit.ly/broken-link"
                                    borderRadius="10px"
                                />
                            }
                            onClick={
                                onItemClick ? () => onItemClick(board) : noop
                            }
                            display="flex"
                            justifyContent="left"
                            borderRadius={0}
                            p={'34px 18px'}
                        >
                            <Text pl={1}>{board.name}</Text>
                        </Button>
                    )
                })}
        </Flex>
    )
}
