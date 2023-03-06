import { HASH_URL_EMPTY, useHashRoute } from './useHashRoute'
import { useRef } from 'react'
import { checkTableauInput } from '../../utils/route/checkTableauInput'
import { getTableauHashEntry } from '../../utils/route/getTableauHashEntry'
import { useAtom } from 'jotai'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'
import { useTableauRoute } from './useTableauRoute'

export type ITableauHashRouteEntry = {
    board: string
    task?: string
} | null

export function useTableauHashUpdate(key?: string) {
    const { onUpdate } = useHashRoute()
    const refTableauUpdate = useRef<
        Map<string, (entry: ITableauHashRouteEntry, path: string) => void>
    >(new Map([]))

    const { pushReset } = useTableauRoute()
    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [_pendingHashEntry, setPendingHashEntry] = useAtom(HashEntryAtom)

    const onHashUpdate = (
        fn: (entry: ITableauHashRouteEntry, path: string) => void
    ) => {
        const fnKey = key ?? fn.toString()
        refTableauUpdate.current.set(fnKey, fn)
    }

    const emitUpdate = (tableauEntry: ITableauHashRouteEntry, path: string) => {
        if (!tableauEntry) return
        if (tableauEntry.board && !tableauEntry.task)
            return refTableauUpdate.current.forEach((fn) =>
                fn(tableauEntry, path)
            )
        return refTableauUpdate.current.forEach((fn) => fn(tableauEntry, path))
    }

    onUpdate((entry, path) => {
        const type = checkTableauInput(entry)
        if (!type) return
        const tableauEntry = getTableauHashEntry(type, entry)
        emitUpdate(tableauEntry, path)
    }, key ?? emitUpdate.toString())

    //We check any other invalid possible route to redirect it to the empty hash state
    onUpdate((entry, path) => {
        const type = checkTableauInput(entry)
        if (type) return
        if (path === HASH_URL_EMPTY) {
            setPendingHashEntry(null)
            return setSelectedBoard(null)
        }
        pushReset()
    }, 'INVALID_ROUTE_EMPTY_HASH')

    return {
        onHashUpdate,
    }
}
