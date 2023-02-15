import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { useTableauQuery } from 'shared-hooks'

export function useTaskPermission() {
    const [selectedBoard] = useAtom(BoardAtom)

    const { data } = useTableauQuery<{
        add: boolean
        edit: boolean
        move: boolean
        delete: boolean
        read: boolean
    }>(['/api/permissions/task', { boardId: selectedBoard?.id }])

    return data
}
