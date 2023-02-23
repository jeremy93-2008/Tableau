import React from 'react'
import { Provider } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'
import { LoadingProvider } from 'shared-components'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { useRefreshSession } from 'shared-hooks'

export default function Home() {
    useRefreshSession()
    return (
        <Flex>
            <Provider>
                <DndProvider options={HTML5toTouch}>
                    <LoadingProvider>
                        <Header />
                        <Body />
                    </LoadingProvider>
                </DndProvider>
            </Provider>
        </Flex>
    )
}
