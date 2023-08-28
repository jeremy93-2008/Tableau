import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { SiFoodpanda } from 'react-icons/si'
import { useSession } from 'next-auth/react'

export function NoBoard() {
    const { data: session } = useSession()

    return (
        <Flex
            width="100%"
            px={4}
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            opacity={0.5}
        >
            <Box mb={3}>
                <SiFoodpanda size="92px" />
            </Box>
            <Text fontWeight="medium" fontSize="1.5rem">
                No Board selected
            </Text>
            <Text
                align="center"
                mt={1}
                w={{ base: '100%', md: '35vw' }}
                minW={{ base: 0, md: '550px' }}
            >
                {session?.user.email
                    ? 'Tip: Cool, now that you logged, you can create a new board by clicking on the' +
                      '"+" button located on the left side, or just selecting an existing one on the side panel on you left.'
                    : 'Tip: To begin with, you must login first by clicking on the' +
                      '"Sign in" button located on the top right side.'}
            </Text>
        </Flex>
    )
}
