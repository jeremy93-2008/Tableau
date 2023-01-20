import React from 'react'
import { Flex } from '@chakra-ui/react'
import { BoardHead } from './components/boardHead'
import { BoardSide } from './components/boardSide'

export function Side() {
    return (
        <Flex
            bg="gray.100"
            color="gray.600"
            borderRight="solid 1px"
            borderColor="gray.400"
            flexDirection="column"
            alignItems="center"
            w="300px"
            minW="300px"
            maxW="300px"
            h="calc(100vh - 72px)"
            flex={1}
        >
            <BoardHead />
            <BoardSide />
        </Flex>
    )
}
