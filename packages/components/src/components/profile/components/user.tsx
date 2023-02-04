import { Button, Image } from '@chakra-ui/react'
import { Session } from 'next-auth'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useCallback, useEffect, useState } from 'react'
import { UserModal } from './userModal'

interface IUserProps {
    session: Session
}

export function User(props: IUserProps) {
    const { session } = props
    const [isUserOpen, setUserOpen] = useState(false)

    const onClickPortal = useCallback(() => {
        setUserOpen(false)
    }, [])

    useEffect(() => {
        document.body.addEventListener('click', onClickPortal)
        return () => {
            document.body.removeEventListener('click', onClickPortal)
        }
    }, [])

    return (
        <>
            <Button
                onClick={(evt) => {
                    setUserOpen(!isUserOpen)
                    evt.stopPropagation()
                }}
                colorScheme="teal"
                leftIcon={
                    <Image
                        borderRadius="full"
                        boxSize="30px"
                        objectFit="cover"
                        src={session.user?.image as string}
                        referrerPolicy="no-referrer"
                        alt="Profile image"
                    />
                }
                rightIcon={isUserOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
                {session.user?.name}
            </Button>
            {isUserOpen && <UserModal session={session} />}
        </>
    )
}
