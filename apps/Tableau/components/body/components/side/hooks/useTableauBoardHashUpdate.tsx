import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { IBoardWithAllRelation } from 'shared-components'
import { useTableauHashUpdate, useTableauRoute } from 'shared-hooks'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'
import { useToast } from '@chakra-ui/react'

export function useTableauBoardHashUpdate(
    listOfBoards: IBoardWithAllRelation[] | undefined,
    onItemClick: (board: IBoardWithAllRelation, pushToRoute?: 'no-push') => void
) {
    const toast = useToast()
    const { onHashUpdate } = useTableauHashUpdate('updateBoardsAndTask')
    const [selectedBoard] = useAtom(BoardAtom)
    const { pushReset, pushBoard } = useTableauRoute()
    const [pendingEntry, setPendingEntry] = useAtom(HashEntryAtom)

    onHashUpdate((entry, path) => {
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
                duration: 4000,
                isClosable: true,
            })
            setPendingEntry(null)
            if (selectedBoard && selectedBoard.id !== pendingEntry.board)
                return pushBoard(selectedBoard)
            return pushReset()
        }
        if (!boardToSelect) {
            setPendingEntry(null)
            return pushReset()
        }
        onItemClick(boardToSelect, 'no-push')
        if (!pendingEntry.task) setPendingEntry(null)
    }, [
        pendingEntry,
        listOfBoards,
        onItemClick,
        pushReset,
        toast,
        setPendingEntry,
    ])
}
