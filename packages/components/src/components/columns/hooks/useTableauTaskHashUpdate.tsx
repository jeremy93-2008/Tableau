import { Task } from '@prisma/client'
import { useAtom } from 'jotai'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useTableauHash } from 'shared-hooks'

export function useTableauTaskHashUpdate(
    task: Task,
    onTaskEdit: (routeToPush?: 'no-push') => void
) {
    const toast = useToast()
    const { pushBoard } = useTableauHash()
    const [selectedBoard] = useAtom(BoardAtom)
    const [pendingEntry, setPendingEntry] = useAtom(HashEntryAtom)

    useEffect(() => {
        if (!selectedBoard) return
        if (!pendingEntry) return
        if (!pendingEntry.task) return
        if (!selectedBoard?.Task.find((t) => t.id === pendingEntry.task)) {
            if (!toast.isActive('task-notfound'))
                toast({
                    title: 'Task not found',
                    description: 'The url provided is not a valid task',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                    id: 'task-notfound',
                })
            setPendingEntry(null)
            pushBoard(selectedBoard)
        }
        if (pendingEntry.task !== task.id) return
        onTaskEdit('no-push')
        setPendingEntry(null)
    }, [
        onTaskEdit,
        pendingEntry,
        pushBoard,
        selectedBoard,
        setPendingEntry,
        task.id,
        toast,
    ])
}
