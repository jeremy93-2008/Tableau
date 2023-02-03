import React from 'react'
import { useAtom } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { NoBoard } from './components/noBoard'
import { Columns } from './components/columns'

import { BoardAtom } from 'shared-atoms'

export function Board() {
    const [selectedBoard] = useAtom(BoardAtom)
    return (
        <Flex bg="gray.50" minW="620px" h="calc(100vh - 72px)" flex={4} px={1}>
            {!selectedBoard && <NoBoard />}
            {selectedBoard && <Columns />}
        </Flex>
    )
}
