import React from 'react'
import { Provider } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'

export default function Home() {
    return (
        <Flex overflow="hidden" flexDirection="column">
            <Provider>
                <Header />
                <Body />
            </Provider>
        </Flex>
    )
}
