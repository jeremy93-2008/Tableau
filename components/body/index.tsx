import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
            <DndProvider backend={HTML5Backend}>
                <Side />
                <Board />
            </DndProvider>
        </Flex>
    )
}
