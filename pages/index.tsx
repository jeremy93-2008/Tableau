import React from 'react'
import { Container } from '@chakra-ui/react'
import { Header } from '../components/header'

export default function Home() {
    return (
        <Container maxW="100vw" display="flex" flexDirection="column" p={0}>
            <Header />
            <h1>Hola mundo</h1>
        </Container>
    )
}
