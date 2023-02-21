import React from 'react'
import { Flex, useColorMode } from '@chakra-ui/react'
import { BoardHead } from './components/boardHead'
import { BoardSide } from './components/boardSide'
import { useAtomValue } from 'jotai'
import { SidePanelAtom } from 'shared-atoms'
import { useThemeMode } from 'shared-hooks'

export function Side() {
    const { bg, text } = useThemeMode()
    const isSidePanelOpen = useAtomValue(SidePanelAtom)
    return (
        <Flex
            id="boardside-container"
            flex={1}
            bg={bg.secondary}
            color={text.primary}
            borderRight="solid 1px"
            borderColor={bg.primary}
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
