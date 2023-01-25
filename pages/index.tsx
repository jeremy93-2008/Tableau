import React from 'react'
import { Provider } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'
import { LoadingProvider } from '../components/loadingProvider'

export default function Home() {
    return (
        <Flex>
            <Provider>
                <LoadingProvider>
                    <Header />
                    <Body />
                </LoadingProvider>
            </Provider>
        </Flex>
    )
}
