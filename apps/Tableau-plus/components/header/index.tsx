import { Flex, Heading } from '@chakra-ui/react'
import { Finder } from 'shared-components'
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
            <Heading as="h1" fontSize="1.5rem">
                Tableau Plus
            </Heading>
            <Finder />
            <Profile />
        </Flex>
    )
}
