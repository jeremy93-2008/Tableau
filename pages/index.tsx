import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Header } from '../components/header'
import { Body } from '../components/body'

export default function Home() {
    return (
        <Flex flexDirection="column">
            <Header />
            <Body />
        </Flex>
    )
}
