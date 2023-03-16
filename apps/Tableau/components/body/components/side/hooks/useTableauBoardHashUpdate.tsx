import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useTableauHashUpdate, useTableauRoute } from 'shared-hooks'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'
import { useToast } from '@chakra-ui/react'
import { IBoardWithAllRelation } from 'shared-types'

export function useTableauBoardHashUpdate(
    listOfBoards: IBoardWithAllRelation[] | undefined,
    onItemClick: (board: IBoardWithAllRelation, noPush?: boolean) => void
) {
    const toast = useToast()
    const { onTableauHashUpdate } = useTableauHashUpdate(
        'UPDATE_ROUTE_BOARDS_TASKS_HASH'
    )
    const [selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const { pushReset } = useTableauRoute()
    const [pendingEntry, setPendingEntry] = useAtom(HashEntryAtom)

    onTableauHashUpdate((entry, path) => {
        setPendingEntry(entry)
    })

    useEffect(() => {
        if (!listOfBoards || !pendingEntry) return
        const boardToSelect = listOfBoards.find(
            (board) => board.id === pendingEntry.board
        )
        if (pendingEntry.board && !boardToSelect) {
            toast({
                title: 'Board not found',
                description: 'The url provided is not a valid board',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setPendingEntry(null)
            return pushReset()
        }
        if (!boardToSelect) {
            setPendingEntry(null)
            return pushReset()
        }
        if (
            !selectedBoard ||
            (selectedBoard && selectedBoard.id !== boardToSelect.id)
        ) {
            onItemClick(boardToSelect, true)
            setSelectedBoard(boardToSelect)
        }
        if (!pendingEntry.task) setPendingEntry(null)
    }, [
        pendingEntry,
        listOfBoards,
        pushReset,
        toast,
        setPendingEntry,
        setSelectedBoard,
        selectedBoard,
        onItemClick,
    ])
}
