import React from 'react'
import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'

interface IBoardListProps {
    listOfBoards?: IBoardWithAllRelation[]
}

export function BoardList(props: IBoardListProps) {
    const { listOfBoards } = props
    return (
        <Flex flexDirection="column" pt={2}>
            {listOfBoards &&
                listOfBoards.map((board) => {
                    return (
                        <Button
                            key={board.id}
                            leftIcon={
                                <Avatar
                                    name={board.name}
                                    src="https://bit.ly/broken-link"
                                    borderRadius="10px"
                                />
                            }
                            display="flex"
                            justifyContent="left"
                            p={'34px 18px'}
                        >
                            <Text pl={1}>{board.name}</Text>
                        </Button>
                    )
                })}
        </Flex>
    )
}
