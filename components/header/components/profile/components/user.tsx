import { Button, Container, Text, Image } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ExternalLinkIcon,
} from '@chakra-ui/icons'
import { useState } from 'react'

interface IUserProps {
    session: Session
}

export function User(props: IUserProps) {
    const { session } = props
    const [isUserOpen, setUserOpen] = useState(false)
    return (
        <>
            <Button
                onClick={() => setUserOpen(!isUserOpen)}
                colorScheme="teal"
                leftIcon={
                    <Image
                        borderRadius="full"
                        boxSize="30px"
                        objectFit="cover"
                        src={session.user?.image as string}
                        alt="Profile image"
                    />
                }
                rightIcon={isUserOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
                {session.user?.name}
            </Button>
            {isUserOpen && (
                <Container
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    position="absolute"
                    top={'72px'}
                    right={4}
                    pt={2}
                    bg="teal.500"
                    borderRadius={'0 0 5px 5px'}
                    w="280px"
                    h="250px"
                >
                    <Image
                        borderRadius="full"
                        boxSize="100px"
                        objectFit="cover"
                        src={session.user?.image as string}
                        alt="Profile image"
                    />
                    <Text pt="5px" fontWeight="bold">
                        {session.user?.name}
                    </Text>
                    <Text fontSize="13px" pt="8px">
                        {session.user?.email}
                    </Text>
                    <Button
                        mt="16px"
                        colorScheme="teal"
                        rightIcon={<ExternalLinkIcon />}
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </Button>
                </Container>
            )}
        </>
    )
}
