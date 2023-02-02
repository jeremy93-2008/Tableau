import React from 'react'
import { QueryClient } from '@tanstack/query-core'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import theme from '../theme/extends'
import { defaultQueryFn } from '../utils/defaultQueryFn'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { queryFn: defaultQueryFn },
    },
})

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <SessionProvider session={session}>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
            </SessionProvider>
        </ChakraProvider>
    )
}
