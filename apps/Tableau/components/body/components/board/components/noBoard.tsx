import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { SiFoodpanda } from 'react-icons/si'

export function NoBoard() {
    return (
        <Flex
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
            <Text align="center" mt={1} w="35vw" minW="550px">
                Tip: To begin, you can create a new board by clicking on the
                &quot;+&quot; button located on the left side.
            </Text>
        </Flex>
    )
}
