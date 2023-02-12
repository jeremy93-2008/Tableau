import React, { useEffect, useMemo } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { LoadingAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'

export function LoadingProvider(props: React.PropsWithChildren) {
    const { children } = props
    const { status: authStatus } = useSession()
    const loading = useAtomValue(LoadingAtom)

    const isLoading = useMemo(() => {
        const isAuthenticating = authStatus === 'loading'
        const queryIsLoading = Object.values(loading.query).some(
            (isLoading) => isLoading
        )
        const mutateIsLoading = loading.mutation

        return queryIsLoading || mutateIsLoading || isAuthenticating
    }, [authStatus, loading.mutation, loading.query])

    console.log(loading)

    return (
        <>
            <Flex flex={1} overflow="hidden" flexDirection="column">
                {children}
            </Flex>
            {isLoading && (
                <Flex
                    position="fixed"
                    bgColor="rgba(0,0,0,0.6)"
                    width="100vw"
                    height="100vh"
                    justifyContent="center"
                    alignItems="center"
                    top={0}
                    zIndex={100}
                >
                    <Spinner width="80px" height="80px" color="teal.200" />
                </Flex>
            )}
        </>
    )
}
