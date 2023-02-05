import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { Flex } from '@chakra-ui/react'
import { NoBoard } from './components/noBoard'
import { Columns } from 'shared-components'
import { BoardAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'

export function Board() {
    const { status } = useSession()
    const [selectedBoard, setSelectedBoard] = useAtom(BoardAtom)

    useEffect(() => {
        if (status === 'unauthenticated' && selectedBoard !== null)
            setSelectedBoard(null)
    }, [status, selectedBoard, setSelectedBoard])

    return (
        <Flex bg="gray.50" minW="620px" h="calc(100vh - 72px)" flex={4} px={1}>
            {!selectedBoard && <NoBoard />}
            {selectedBoard && <Columns />}
        </Flex>
    )
}
