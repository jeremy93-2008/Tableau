import {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import { parsePath } from '../utils/parsePath'

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
        if (refSubscription.current.has(key)) return
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

    const handleHashChange = useCallback(() => {
        const val = parsePath(location.hash)
        ctxValue.path = location.hash
        ctxValue.entry = { path: location.hash, values: val }
        ctxValue.history.push({ path: location.hash, values: val })

        emitUpdate(ctxValue.entry, ctxValue.path)
    }, [ctxValue, emitUpdate])

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
