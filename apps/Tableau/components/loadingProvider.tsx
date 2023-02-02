import React, { useEffect } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { LoadingAtom } from '../atoms/loadingAtom'
import { useSession } from 'next-auth/react'

export function LoadingProvider(props: React.PropsWithChildren) {
    const { children } = props
    const { status: authStatus } = useSession()
    const [loading, setLoading] = useAtom(LoadingAtom)

    useEffect(() => {
        if (authStatus === 'loading')
            return setLoading({ isLoading: true, reason: 'auth' })
        if (loading.reason === 'auth')
            setLoading({ isLoading: false, reason: 'auth' })
    }, [authStatus, loading, setLoading])

    return (
        <>
            <Flex flex={1} overflow="hidden" flexDirection="column">
                {children}
            </Flex>
            {loading.isLoading && (
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