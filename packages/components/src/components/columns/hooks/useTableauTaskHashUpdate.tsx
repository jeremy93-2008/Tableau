import { Task } from '@prisma/client'
import { useAtom } from 'jotai'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useTableauRoute } from 'shared-hooks'

export function useTableauTaskHashUpdate(
    task: Task,
    onTaskEdit: (routeToPush?: 'no-push') => void,
    onCloseModal: () => void
) {
    const toast = useToast()
    const { pushBoard } = useTableauRoute()
    const [selectedBoard] = useAtom(BoardAtom)
    const [pendingEntry, setPendingEntry] = useAtom(HashEntryAtom)

    useEffect(() => {
        if (!selectedBoard) return
        if (!pendingEntry) return
        if (!pendingEntry.task) return
        if (selectedBoard.id !== pendingEntry.board) return
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
        onCloseModal()
        if (pendingEntry.task !== task.id) return
        onTaskEdit('no-push')
        setPendingEntry(null)
    }, [
        onCloseModal,
        onTaskEdit,
        pendingEntry,
        pushBoard,
        selectedBoard,
        setPendingEntry,
        task.id,
        toast,
    ])
}
