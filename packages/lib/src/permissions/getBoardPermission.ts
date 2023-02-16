import { BoardUserSharing } from '@prisma/client'
import { IPermission } from './type'

export function getBoardPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: true,
        edit: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        read: true,
        move: false,
    } as IPermission
}
