import React from 'react'
import { Provider } from 'jotai'
import { Alert, AlertIcon, Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'
import { LoadingProvider } from 'shared-components'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default function Home() {
    return (
        <Flex>
            <Provider>
                <DndProvider backend={HTML5Backend}>
                    <LoadingProvider>
                        <Alert status="warning">
                            <AlertIcon />
                            The application is not suitable for use. Tableau
                            still on the development, use it on you own risk.
                            (Loading screen feedback are not available
                            temporary)
                        </Alert>
                        <Header />
                        <Body />
                    </LoadingProvider>
                </DndProvider>
            </Provider>
        </Flex>
    )
}
