import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BoardList } from './boardList'
import { BoardNew } from './boardNew'

export function BoardSide() {
    return (
        <Flex width="100%">
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
                    <BoardNew />
                </Flex>
            </Flex>
            <BoardList />
        </Flex>
    )
}
