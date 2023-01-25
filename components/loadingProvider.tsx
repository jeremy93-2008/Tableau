import React from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { LoadingAtom } from '../atoms/loadingAtom'

export function LoadingProvider(props: React.PropsWithChildren) {
    const { children } = props
    const [isLoading, _setLoading] = useAtom(LoadingAtom)
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
