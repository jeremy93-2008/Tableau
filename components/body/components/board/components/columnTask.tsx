import React from 'react'
import { Container, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { Status } from '.prisma/client'
import { AddIcon } from '@chakra-ui/icons'
import { ColumnNew } from './columnNew'

interface IColumnTaskProps {
    status?: Status
    newColumn?: boolean
}

export function ColumnTask(props: IColumnTaskProps) {
    const { status, newColumn } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedBoard] = useAtom(BoardAtom)
    return (
        <Container
            bgColor={newColumn ? '#38B2AC99' : 'teal.400'}
            color="gray.100"
            borderRadius={10}
            flexDirection="column"
            minW={280}
            w={280}
            mr={4}
            ml={2}
        >
            {!newColumn && status && (
                <>
                    <Text my={3} fontSize="16px" fontWeight="bold">
                        {status?.name}
                    </Text>
                    <VStack></VStack>
                </>
            )}
            {newColumn && (
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    h="100%"
                >
                    <ColumnNew
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                    />
                </Flex>
            )}
        </Container>
    )
}
