import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function Callback() {
    const router = useRouter()
    const { data: session } = useSession()
    useEffect(() => {
        fetch(`/api/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(session?.user),
        }).then(() => {
            router.push('/').then()
        })
    }, [])
    return <div>Redirecting...</div>
}
