import { useHashRoute } from './useHashRoute'
import { useCallback } from 'react'
import { IBoardWithAllRelation, IFullTask } from 'shared-types'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'

export function useTableauRoute() {
    const [selectedBoard] = useAtom(BoardAtom)
    const { push } = useHashRoute()
    const pushBoard = useCallback(
        (board: IBoardWithAllRelation) => {
            push(`board/${board.id}`)
            document.title = `${board.name} - Tableau`
        },
        [push]
    )

    const pushTask = useCallback(
        (task: IFullTask) => {
            push(`board/${task.boardId}/task/${task.id}`)
            document.title = `[${selectedBoard?.name}] ${task.name} - Tableau`
        },
        [push, selectedBoard]
    )

    const pushReset = useCallback(() => {
        push('')
        document.title = 'Tableau - A Board Web App'
    }, [push])

    return { pushReset, pushBoard, pushTask }
}
