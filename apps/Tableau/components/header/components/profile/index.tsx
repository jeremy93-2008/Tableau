import { useSession } from 'next-auth/react'
import { User } from './components/user'
import { Signin } from './components/signin'

export function Profile() {
    const { data: session } = useSession()
    if (session) return <User session={session} />
    return <Signin />
}
