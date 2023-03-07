import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { NoBoard } from './components/noBoard'
import { Columns } from 'shared-components'
import { BoardAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'
import { useTableauRoute, useThemeMode } from 'shared-hooks'
import { HASH_URL_EMPTY } from 'shared-hooks'
import { useTableauResetHashUpdate } from './hooks/useTableauResetHashUpdate'

export function Board() {
    const { status } = useSession()
    const [selectedBoard] = useAtom(BoardAtom)
    const { pushReset } = useTableauRoute()
    const { bg } = useThemeMode()

    const { onHashUpdate } = useTableauResetHashUpdate()

    useEffect(() => {
        const handleUnauthenticatedState = () => {
            if (
                status === 'unauthenticated' &&
                location.hash !== HASH_URL_EMPTY
            )
                pushReset()
        }
        if (status === 'unauthenticated' && selectedBoard !== null) pushReset()
        handleUnauthenticatedState()

        onHashUpdate(() => {
            handleUnauthenticatedState()
        })
    }, [status, selectedBoard, pushReset, onHashUpdate])

    return (
        <Flex
            bg={bg.tertiary}
            minW={{ base: '0', md: '620px' }}
            h="calc(100vh - 72px)"
            flex={4}
            px={1}
        >
            {!selectedBoard && <NoBoard />}
            {selectedBoard && <Columns />}
        </Flex>
    )
}
