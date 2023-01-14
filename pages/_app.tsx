import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme/extends'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </ChakraProvider>
    )
}
