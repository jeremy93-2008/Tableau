import { useHashRoute } from './useHashRoute'
import { useCallback } from 'react'
import { IBoardWithAllRelation } from 'shared-components'
import { Task } from '@prisma/client'

export function useTableauRoute() {
    const { push } = useHashRoute()
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

    return { pushReset, pushBoard, pushTask }
}
