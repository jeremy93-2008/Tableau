import { BoardUserSharing } from '@prisma/client'

export function getBoardPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: true,
        edit: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditSchema ?? false,
        read: true,
    }
}
