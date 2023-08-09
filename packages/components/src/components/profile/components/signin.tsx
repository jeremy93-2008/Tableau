import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@chakra-ui/react'
import { ExternalLinkIcon, SpinnerIcon } from '@chakra-ui/icons'
import { getAnimation } from 'shared-utils'

export function Signin() {
    const [isSignLoading, setSignInLoading] = useState(false)
    const { spiningAnimation } = getAnimation({
        spining: { duration: '1s', timing: 'linear', iteration: 'infinite' },
    })
    return (
        <Button
            data-cy="signIn"
            colorScheme="teal"
            isDisabled={isSignLoading}
            leftIcon={
                isSignLoading ? (
                    <SpinnerIcon animation={spiningAnimation} />
                ) : (
                    <></>
                )
            }
            rightIcon={isSignLoading ? <></> : <ExternalLinkIcon />}
            onClick={() => {
                setSignInLoading(true)
                signIn('auth0', { callbackUrl: '/' }, { prompt: 'login' }).then(
                    () => {
                        setSignInLoading(false)
                    }
                )
            }}
        >
            Sign in
        </Button>
    )
}
