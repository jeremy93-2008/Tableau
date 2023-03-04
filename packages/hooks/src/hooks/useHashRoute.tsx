import { useCallback, useContext, useRef } from 'react'
import {
    DefaultHashRouterCtx,
    IHashRouteEntry,
} from '../providers/HashRouterProvider'

export function useHashRoute() {
    const hashRouterCtx = useContext(DefaultHashRouterCtx)

    const onHashUpdateRoute = useCallback(
        (
            fn: (entry: IHashRouteEntry, path: string) => void,
            key?: string | symbol
        ) => {
            hashRouterCtx.subscribe(fn, key ?? fn.toString())
        },
        [hashRouterCtx]
    )

    const pushRoute = useCallback((hash: string) => {
        location.hash = `#/${hash}`
    }, [])

    return {
        push: pushRoute,
        history: hashRouterCtx.history,
        onUpdate: onHashUpdateRoute,
        context: hashRouterCtx,
    }
}
