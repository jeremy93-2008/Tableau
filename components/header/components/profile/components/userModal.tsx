import { Button, Container, Image, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'

interface IUserModalProps {
    session: Session
}

export function UserModal(props: IUserModalProps) {
    const { session } = props

    return (
        <Container
            onClick={(evt) => {
                evt.stopPropagation()
            }}
            display="flex"
            flexDir="column"
            alignItems="center"
            position="absolute"
            zIndex={15}
            top={'72px'}
            right={4}
            pt={2}
            bg="teal.500"
            borderRadius={'0 0 5px 5px'}
            boxShadow={'7px 7px 15px -5px teal'}
            w="280px"
            h="250px"
        >
            <Image
                borderRadius="full"
                boxSize="100px"
                objectFit="cover"
                src={session.user?.image as string}
                referrerPolicy="no-referrer"
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
                onClick={(evt) => {
                    signOut().then()
                    evt.stopPropagation()
                }}
            >
                Sign Out
            </Button>
        </Container>
    )
}
