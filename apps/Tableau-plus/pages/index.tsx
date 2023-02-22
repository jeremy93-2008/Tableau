import React from 'react'
import { Provider } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'
import { LoadingProvider } from 'shared-components'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useRefreshSession } from 'shared-hooks'

export default function Home() {
    useRefreshSession()
    return (
        <Flex>
            <Provider>
                <DndProvider backend={HTML5Backend}>
                    <LoadingProvider>
                        <Header />
                        <Body />
                    </LoadingProvider>
                </DndProvider>
            </Provider>
        </Flex>
    )
}
