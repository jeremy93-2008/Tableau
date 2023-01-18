import React from 'react'
import { Flex } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function BoardList() {
    const { data: session } = useSession()
    const { data } = useQuery(['/board/list'], { enabled: !!session })
    return <Flex>{JSON.stringify(data)}</Flex>
}
