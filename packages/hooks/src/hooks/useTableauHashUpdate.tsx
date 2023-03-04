import { useHashRoute } from './useHashRoute'
import { useCallback, useRef } from 'react'
import { IHashRouteEntry } from '../providers/HashRouterProvider'
import { checkTableauInput } from '../utils/checkTableauInput'

export function useTableauHashUpdate() {
    const { onUpdate } = useHashRoute()
    const refBoardUpdate = useRef<
        Map<string, (entry: IHashRouteEntry, path: string) => void>
    >(new Map([]))
    const refTaskUpdate = useRef<
        Map<string, (entry: IHashRouteEntry, path: string) => void>
    >(new Map([]))

    const onBoardUpdate = useCallback(
        (fn: (entry: IHashRouteEntry, path: string) => void) => {
            const key = fn.toString()
            if (refBoardUpdate.current.has(key)) return
            refBoardUpdate.current.set(key, fn)
        },
        []
    )

    const onTaskUpdate = useCallback(
        (fn: (entry: IHashRouteEntry, path: string) => void) => {
            const key = fn.toString()
            if (refTaskUpdate.current.has(key)) return
            refTaskUpdate.current.set(key, fn)
        },
        []
    )

    const emitUpdate = useCallback(
        (type: 'board' | 'task', entry: IHashRouteEntry, path: string) => {
            if (type === 'board')
                return refBoardUpdate.current.forEach((fn) => fn(entry, path))
            return refTaskUpdate.current.forEach((fn) => fn(entry, path))
        },
        []
    )

    onUpdate((entry, path) => {
        const type = checkTableauInput(entry)
        if (!type) return
        emitUpdate(type, entry, path)
    })

    return {
        onBoardUpdate,
        onTaskUpdate,
    }
}
