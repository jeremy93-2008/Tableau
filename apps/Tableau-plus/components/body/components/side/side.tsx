import React from 'react'
import { Flex } from '@chakra-ui/react'
import { BoardHead } from './components/boardHead'
import { BoardSide } from './components/boardSide'
import { useAtomValue } from 'jotai'
import { SidePanelAtom } from 'shared-atoms'

export function Side() {
    const isSidePanelOpen = useAtomValue(SidePanelAtom)
    return (
        <Flex
            id="boardside-container"
            flex={1}
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
            zIndex={10}
            position={{ base: 'absolute', md: 'relative' }}
            left={{ base: isSidePanelOpen ? 0 : '-300px', md: 0 }}
            transition="left .3s ease-in-out"
        >
            <BoardHead />
            <BoardSide />
        </Flex>
    )
}
