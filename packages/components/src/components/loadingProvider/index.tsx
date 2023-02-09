import React, { useEffect } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { LoadingAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'

export function LoadingProvider(props: React.PropsWithChildren) {
    const { children } = props
    const { status: authStatus } = useSession()

    return (
        <>
            <Flex flex={1} overflow="hidden" flexDirection="column">
                {children}
            </Flex>
        </>
    )
}
