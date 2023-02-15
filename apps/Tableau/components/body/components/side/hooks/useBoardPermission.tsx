import { useTableauQuery } from 'shared-hooks'
import { IBoardWithAllRelation } from '../../../../../types/types'

export function useBoardPermission(board: IBoardWithAllRelation) {
    const { data } = useTableauQuery<{
        add: boolean
        edit: boolean
        move: boolean
        delete: boolean
        read: boolean
    }>(['/api/permissions/board', { boardId: board.id }], {
        enabled: !!board.id,
    })

    return data
}
