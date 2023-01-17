import { Flex, Heading } from '@chakra-ui/react'
import { Profile } from './components/profile'

export function Header() {
    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            bg="teal.500"
            color="white"
            py="4"
            px="8"
        >
            <Heading as="h1" fontSize="1.5rem">
                Tableau
            </Heading>
            <Profile />
        </Flex>
    )
}
