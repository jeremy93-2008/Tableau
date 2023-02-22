import { useCallback, useEffect } from 'react'
import { reloadSession } from 'shared-utils'

export function useRefreshSession() {
    const listener = useCallback(() => {
        reloadSession()
    }, [])
    useEffect(() => {
        window.addEventListener('focus', listener, false)
        return () => window.removeEventListener('focus', listener, false)
    }, [listener])

    return { reloadSession: listener }
}
