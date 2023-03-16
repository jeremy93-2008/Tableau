import { useHashRoute } from './useHashRoute'
import { useCallback } from 'react'
import { IBoardWithAllRelation } from 'shared-types'
import { Task } from '@prisma/client'

export function useTableauRoute() {
    const { push } = useHashRoute()
    const pushBoard = useCallback(
        (board: IBoardWithAllRelation) => {
            push(`board/${board.id}`)
        },
        [push]
    )

    const pushTask = useCallback(
        (task: Task) => {
            push(`board/${task.boardId}/task/${task.id}`)
        },
        [push]
    )

    const pushReset = useCallback(() => {
        push('')
    }, [push])

    return { pushReset, pushBoard, pushTask }
}
