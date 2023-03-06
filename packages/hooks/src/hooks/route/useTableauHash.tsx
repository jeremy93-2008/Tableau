import { useHashRoute } from './useHashRoute'
import { useCallback, useRef } from 'react'
import { checkTableauInput } from '../../utils/route/checkTableauInput'
import { getTableauHashEntry } from '../../utils/route/getTableauHashEntry'
import { IBoardWithAllRelation } from 'shared-components'
import { Task } from '@prisma/client'

export type ITableauHashRouteEntry = {
    board: string
    task?: string
} | null

export function useTableauHash() {
    const { push, onUpdate } = useHashRoute()
    const refTableauUpdate = useRef<
        Map<string, (entry: ITableauHashRouteEntry, path: string) => void>
    >(new Map([]))

    const onHashUpdate = useCallback(
        (fn: (entry: ITableauHashRouteEntry, path: string) => void) => {
            const key = fn.toString()
            refTableauUpdate.current.set(key, fn)
        },
        []
    )

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
    })

    const pushBoard = useCallback(
        (board: IBoardWithAllRelation) => {
            push(`b/${board.id}`)
        },
        [push]
    )

    const pushTask = useCallback(
        (task: Task) => {
            push(`b/${task.boardId}/t/${task.id}`)
        },
        [push]
    )

    const pushReset = useCallback(() => {
        push('')
    }, [push])

    return {
        onHashUpdate,
        pushBoard,
        pushTask,
        pushReset,
    }
}
