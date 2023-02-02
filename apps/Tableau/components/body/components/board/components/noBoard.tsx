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
            <Text mt={1}>
                Tip: Click on one of those buttons under &quot;Your
                boards&quot;, on the left side to open one
            </Text>
        </Flex>
    )
}
