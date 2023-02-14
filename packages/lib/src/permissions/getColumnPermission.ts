import { BoardUserSharing } from '@prisma/client'

export function getColumnPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        edit: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        move: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        read: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
    }
}
