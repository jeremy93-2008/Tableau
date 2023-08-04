import { useSession } from 'next-auth/react'
import { useTableauQuery, useTableauRoute } from 'shared-hooks'
import { IBoardWithAllRelation } from 'shared-types'
import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { BoardAtom, HighlightTaskAtom } from 'shared-atoms'
import { Task } from '.prisma/client'

export function useHighlightFinderTask(onAfterHighlight: (task: Task) => void) {
    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [_highlightTask, setHighlightTask] = useAtom(HighlightTaskAtom)

    const { pushBoard } = useTableauRoute()

    const { data: session } = useSession()

    const { data, refetch, isRefetching } = useTableauQuery<
        IBoardWithAllRelation[]
    >(['api/board/list'], {
        enabled: !!session,
    })

    const handleHighlightTask = useCallback(
        (task: Task) => () => {
            if (!data) return
            const newSelectedBoard = data.find(
                (board) => board.id === task.boardId
            )
            if (!newSelectedBoard) return
            pushBoard(newSelectedBoard)
            // We wait until React finish to send us to the new selected board
            window.requestAnimationFrame(() => {
                setHighlightTask(task)
                if (onAfterHighlight) onAfterHighlight(task)
            })
        },
        [data, pushBoard, setHighlightTask, onAfterHighlight]
    )

    return {
        handleHighlightTask,
    }
}
