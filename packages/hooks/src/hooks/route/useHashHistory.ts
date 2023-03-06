import { useCallback } from 'react'
import { IHashRouteEntry } from '../../providers/route/HashRouterProvider'

export function useHashHistory(history: IHashRouteEntry[]) {
    const has = useCallback(
        (path: string) => {
            if (history.length <= 0) return false
            return !!history.find((entry) => entry.path.includes(path))
        },
        [history]
    )

    const first = useCallback(() => {
        if (history.length <= 0) return null
        return history[0]
    }, [history])

    const last = useCallback(() => {
        if (history.length <= 0) return null
        return history[history.length - 1]
    }, [history])

    const add = useCallback(() => {
        if (history.length <= 0) return null
        return history[history.length - 1]
    }, [history])

    const get = useCallback(
        (path: string) => {
            if (history.length <= 0) return null
            return history.find((entry) => entry.path.includes(path)) ?? null
        },
        [history]
    )

    return { has, first, last, add, get, history }
}
