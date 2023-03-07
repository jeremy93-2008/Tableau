import {
    checkTableauInput,
    HASH_URL_EMPTY,
    useTableauHashUpdate,
    useTableauRoute,
} from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom, HashEntryAtom } from 'shared-atoms'

export function useTableauResetHashUpdate() {
    const { onHashUpdate } = useTableauHashUpdate()

    const { pushReset } = useTableauRoute()
    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [_pendingHashEntry, setPendingHashEntry] = useAtom(HashEntryAtom)

    //We check any other invalid possible route to redirect it to the empty hash state
    onHashUpdate((entry, path) => {
        const type = checkTableauInput(entry)
        if (type) return
        if (path === HASH_URL_EMPTY) {
            setPendingHashEntry(null)
            return setSelectedBoard(null)
        }
        pushReset()
    }, 'INVALID_ROUTE_EMPTY_HASH')

    return { onHashUpdate }
}
