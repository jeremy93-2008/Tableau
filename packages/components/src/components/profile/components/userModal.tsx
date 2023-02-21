import {
    Button,
    Container,
    Flex,
    IconButton,
    Image,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import { ExternalLinkIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { useThemeMode } from 'shared-hooks'

interface IUserModalProps {
    session: Session
}

export function UserModal(props: IUserModalProps) {
    const { session } = props
    const { colorMode, toggleColorMode } = useColorMode()
    const { bg } = useThemeMode()
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
            bg={bg.primary}
            borderRadius={'0 0 5px 5px'}
            boxShadow={'7px 7px 15px -5px teal'}
            w="280px"
            h="300px"
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
            <Flex mt={4} alignItems="center">
                <Text fontSize="13px" mr={4}>
                    Theme Color
                </Text>
                <IconButton
                    colorScheme="teal"
                    aria-label="Toggle light dark mode"
                    onClick={toggleColorMode}
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                />
            </Flex>
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
