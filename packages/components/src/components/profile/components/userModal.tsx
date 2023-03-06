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
import { useTableauMutation, useTableauRoute, useThemeMode } from 'shared-hooks'
import { useCallback } from 'react'
import axios from 'axios'
import { reloadSession } from 'shared-utils'

interface IUserModalProps {
    session: Session
}

export function UserModal(props: IUserModalProps) {
    const { session } = props

    const { pushReset } = useTableauRoute()
    const { colorMode, toggleColorMode } = useColorMode()
    const { bg } = useThemeMode()

    const { mutateAsync, isLoading } = useTableauMutation(
        (value: { email: string; isDarkMode: boolean }) => {
            return axios.post(`api/user/setTheme`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const handleColorMode = useCallback(() => {
        const isNewDarkMode = colorMode === 'light'
        mutateAsync({
            email: session.user!.email!,
            isDarkMode: isNewDarkMode,
        }).then(() => {
            reloadSession()
        })
    }, [mutateAsync, session.user, colorMode])

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
                    isDisabled={isLoading}
                    colorScheme="teal"
                    aria-label="Toggle light/dark mode"
                    onClick={handleColorMode}
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                />
            </Flex>
            <Button
                mt="16px"
                colorScheme="teal"
                rightIcon={<ExternalLinkIcon />}
                onClick={(evt) => {
                    signOut().then()
                    pushReset()
                    evt.stopPropagation()
                }}
            >
                Sign Out
            </Button>
        </Container>
    )
}
