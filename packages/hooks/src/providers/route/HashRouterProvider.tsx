import {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import { parsePath } from '../../utils/parsePath'
import { useHashHistory } from '../../hooks/route/useHashHistory'

export type IHashRouterCtx = {
    history: IHashRouteEntry[]
    path: string
    entry: IHashRouteEntry | null
    subscribe: (fn: Function, key: string | symbol) => void
}

export type IHashRouteEntry = {
    values: string[]
    path: string
}

export const DefaultHashRouterCtx = createContext<IHashRouterCtx>({
    history: [],
    path: '',
    entry: null,
    subscribe: () => {},
})
export function HashRouterProvider(props: PropsWithChildren) {
    const refSubscription = useRef<Map<string | symbol, Function>>(new Map([]))

    const subscribe = useCallback((fn: Function, key: string | symbol) => {
        refSubscription.current.set(key, fn)
    }, [])

    const emitUpdate = useCallback((entry: IHashRouteEntry, path: string) => {
        refSubscription.current.forEach((fn) => {
            fn(entry, path)
        })
    }, [])

    const ctxValue = useMemo(
        () =>
            ({
                path: '',
                entry: null,
                history: [],
                subscribe,
            } as IHashRouterCtx),
        [subscribe]
    )

    const history = useHashHistory(ctxValue.history)

    const handleHashChange = useCallback(() => {
        const val = parsePath(location.hash)

        const lastHistory = history.last()
        if (lastHistory && lastHistory.path === location.hash) return

        ctxValue.path = location.hash
        ctxValue.entry = { path: location.hash, values: val }
        ctxValue.history.push({ path: location.hash, values: val })

        emitUpdate(ctxValue.entry, ctxValue.path)
    }, [ctxValue, emitUpdate, history])

    useEffect(() => {
        handleHashChange()
    }, [handleHashChange])

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [handleHashChange])

    return (
        <DefaultHashRouterCtx.Provider value={ctxValue}>
            {props.children}
        </DefaultHashRouterCtx.Provider>
    )
}
