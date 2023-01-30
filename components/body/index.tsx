import { Flex } from '@chakra-ui/react'
import { Side } from './components/side/side'
import { Board } from './components/board/board'

export function Body() {
    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            h="calc(100vh - 72px)"
        >
            <Side />
            <Board />
        </Flex>
    )
}
