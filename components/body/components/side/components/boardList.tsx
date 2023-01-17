import React from 'react'
import { Flex } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

export function BoardList() {
    const { data } = useQuery(['/board/list'])
    return <Flex>{JSON.stringify(data)}</Flex>
}
