import { useSession } from 'next-auth/react'
import { useTableauQuery } from '../../../../../hooks/useTableauQuery'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { BoardAtom, HighlightTaskAtom } from 'shared-atoms'
import { Task } from '.prisma/client'

export function useHighlightFinderTask(onAfterHighlight: (task: Task) => void) {
    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [_highlightTask, setHighlightTask] = useAtom(HighlightTaskAtom)
    const { data: session } = useSession()

    const { data, refetch, isRefetching } = useTableauQuery<
        IBoardWithAllRelation[]
    >(['api/board/list'], {
        enabled: !!session,
        refetchOnWindowFocus: false,
    })

    const handleHighlightTask = useCallback(
        (task: Task) => () => {
            if (!data) return
            console.log(data.find((board) => board.id === task.boardId))
            setSelectedBoard(data.find((board) => board.id === task.boardId)!)
            setHighlightTask(task)
            if (onAfterHighlight) onAfterHighlight(task)
        },
        [data, onAfterHighlight, setSelectedBoard, setHighlightTask]
    )

    return {
        handleHighlightTask,
    }
}
