import { BoardUserSharing } from '@prisma/client'
import { IPermission } from './type'

export function getTaskPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        edit: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        move: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        read: true,
    } as IPermission
}
