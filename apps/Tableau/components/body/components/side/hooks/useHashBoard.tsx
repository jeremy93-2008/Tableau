import { IBoardWithAllRelation } from 'shared-components'
import { useTableauHash } from 'shared-hooks'
import { useEffect, useState } from 'react'
import { ITableauHashRouteEntry } from 'shared-hooks'

export function useHashBoard(
    listOfBoards: IBoardWithAllRelation[] | undefined,
    onItemClick: (board: IBoardWithAllRelation, pushToRoute?: 'no-push') => void
) {
    const { onHashBoardUpdate } = useTableauHash()
    const [entry, setEntry] = useState<ITableauHashRouteEntry>(null)

    onHashBoardUpdate((entry, path) => {
        setEntry(entry)
    })

    useEffect(() => {
        if (!listOfBoards || !entry) return
        const boardToSelect = listOfBoards.find(
            (board) => board.id === entry.board
        )
        if (!boardToSelect) return
        onItemClick(boardToSelect, 'no-push')
    }, [entry, listOfBoards, onItemClick])
}
