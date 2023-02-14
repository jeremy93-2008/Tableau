import { BoardUserSharing } from '@prisma/client'

export function getTaskPermission(
    currentUserOfBoardSharingToEdit: BoardUserSharing | null
) {
    return {
        add: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        edit: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        move: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        delete: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
        read: currentUserOfBoardSharingToEdit?.canEditContent ?? false,
    }
}
