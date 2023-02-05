import { Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export function Signin() {
    return (
        <Button
            colorScheme="teal"
            rightIcon={<ExternalLinkIcon />}
            onClick={() =>
                signIn('auth0', { callbackUrl: '/' }, { prompt: 'login' })
            }
        >
            Sign in
        </Button>
    )
}
