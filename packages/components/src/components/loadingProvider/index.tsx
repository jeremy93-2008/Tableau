import React, { useEffect, useMemo } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { LoadingAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'

interface ILoadingProviderProps extends React.PropsWithChildren {
    loadingKey?: string
}

export function LoadingProvider(props: ILoadingProviderProps) {
    const { loadingKey, children } = props
    const { status: authStatus } = useSession()
    const loading = useAtomValue(LoadingAtom)

    const isLoading = useMemo(() => {
        const isAuthenticating = authStatus === 'loading'
        const queryIsLoading = Object.values(loading.query)
            .filter((load) => load.loadingKey === loadingKey)
            .some((load) => load.isLoading)

        const mutateIsLoading = loading.mutation.isLoading

        return queryIsLoading || mutateIsLoading || isAuthenticating
    }, [authStatus, loadingKey, loading.mutation, loading.query])

    return (
        <>
            <Flex flex={1} width="100%" flexDirection="column">
                {children}
            </Flex>
            {isLoading && (
                <Flex
                    position="absolute"
                    bgColor="rgba(0,0,0,0.6)"
                    width="100%"
                    height="100%"
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
