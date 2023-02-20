import { Flex, Heading, Text } from '@chakra-ui/react'
import { Finder, Icon } from 'shared-components'
import { Profile } from 'shared-components'

export function Header() {
    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            bg="teal.500"
            color="white"
            py="4"
            px="8"
            zIndex={15}
        >
            <Heading
                as="h1"
                display="flex"
                alignItems="center"
                fontSize="1.5rem"
            >
                <Icon />
                <Text ml={2} fontFamily="sans-serif">
                    Tableau
                </Text>
            </Heading>
            <Finder />
            <Profile />
        </Flex>
    )
}
