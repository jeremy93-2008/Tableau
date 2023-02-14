import { BoardUserSharing } from '@prisma/client'

export function getBoardPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        edit: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        read: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
    }
}
