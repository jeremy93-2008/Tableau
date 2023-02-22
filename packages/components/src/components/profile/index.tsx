import { useSession } from 'next-auth/react'
import { User } from './components/user'
import { Signin } from './components/signin'
import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

declare module 'next-auth' {
    interface Session {
        user: {
            name: string
            email: string
            image: string
            isDarkMode: boolean
        }
    }
}

export function Profile() {
    const { data: session, status } = useSession()
    const { colorMode, setColorMode } = useColorMode()

    useEffect(() => {
        if (status === 'unauthenticated' || !session) return
        const isCurrentlyDarkMode = colorMode === 'dark'
        if (isCurrentlyDarkMode === session.user.isDarkMode) return
        setColorMode(session.user.isDarkMode ? 'dark' : 'light')
    }, [colorMode, session, setColorMode, status])

    if (session) return <User session={session} />
    return <Signin />
}
