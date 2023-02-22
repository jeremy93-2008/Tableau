import { useCallback, useEffect } from 'react'
import { reloadSession } from 'shared-utils'
import { useSession } from 'next-auth/react'

export function useRefreshSession() {
    const { status } = useSession()
    const listener = useCallback(() => {
        reloadSession()
    }, [])
    useEffect(() => {
        if (status === 'unauthenticated') return
        window.addEventListener('focus', listener, false)
        return () => window.removeEventListener('focus', listener, false)
    }, [listener, status])

    return { reloadSession: listener }
}
