import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Head } from './components/head'
import { BoardSide } from './components/boardSide'

export function Side() {
    return (
        <Flex
            bg="gray.100"
            borderRight="solid 1px"
            borderColor="gray.400"
            flexDirection="column"
            alignItems="center"
            minW="180px"
            h="calc(100vh - 72px)"
            flex={1}
        >
            <Head />
            <BoardSide />
        </Flex>
    )
}
