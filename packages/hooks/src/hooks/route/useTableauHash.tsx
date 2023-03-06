import { useHashRoute } from './useHashRoute'
import { useCallback, useRef } from 'react'
import { checkTableauInput } from '../../utils/route/checkTableauInput'
import { getTableauHashEntry } from '../../utils/route/getTableauHashEntry'
import { IBoardWithAllRelation } from 'shared-components'

export type ITableauHashRouteEntry = {
    board: string
    task?: string
} | null

export function useTableauHash() {
    const { push, onUpdate } = useHashRoute()
    const refBoardUpdate = useRef<
        Map<string, (entry: ITableauHashRouteEntry, path: string) => void>
    >(new Map([]))
    const refTaskUpdate = useRef<
        Map<string, (entry: ITableauHashRouteEntry, path: string) => void>
    >(new Map([]))

    const onHashBoardUpdate = useCallback(
        (fn: (entry: ITableauHashRouteEntry, path: string) => void) => {
            const key = fn.toString()
            refBoardUpdate.current.set(key, fn)
        },
        []
    )

    const onHashTaskUpdate = useCallback(
        (fn: (entry: ITableauHashRouteEntry, path: string) => void) => {
            const key = fn.toString()
            refTaskUpdate.current.set(key, fn)
        },
        []
    )

    const emitUpdate = (tableauEntry: ITableauHashRouteEntry, path: string) => {
        if (!tableauEntry) return
        if (tableauEntry.board && !tableauEntry.task)
            return refBoardUpdate.current.forEach((fn) =>
                fn(tableauEntry, path)
            )
        return refTaskUpdate.current.forEach((fn) => fn(tableauEntry, path))
    }

    onUpdate((entry, path) => {
        const type = checkTableauInput(entry)
        if (!type) return
        const tableauEntry = getTableauHashEntry(type, entry)
        emitUpdate(tableauEntry, path)
    })

    const pushBoard = useCallback(
        (board: IBoardWithAllRelation) => {
            push(`b/${board.id}`)
        },
        [push]
    )

    return {
        onHashBoardUpdate,
        onHashTaskUpdate,
        pushBoard,
    }
}
