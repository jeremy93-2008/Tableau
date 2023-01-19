import React, { useCallback } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BoardList } from './boardList'
import { BoardNew } from './boardNew'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { IBoardWithAllRelation } from '../../../../../types/types'

export function BoardSide() {
    const { data: session } = useSession()
    const { data, refetch } = useQuery<IBoardWithAllRelation[]>(
        ['/board/list'],
        {
            enabled: !!session,
        }
    )

    const onAfterSubmit = useCallback(() => {
        refetch().then()
    }, [refetch])

    return (
        <Flex flexDirection="column" width="100%">
            <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2}
            >
                <Flex>
                    <Text fontWeight="bold" py={2}>
                        Your boards
                    </Text>
                </Flex>
                <Flex>
                    <BoardNew onAfterSubmit={onAfterSubmit} />
                </Flex>
            </Flex>
            <BoardList listOfBoards={data} />
        </Flex>
    )
}
