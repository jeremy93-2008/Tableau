import { getUserPermissionTable } from '../auth/getUserPermissionTable'
import { ErrorMessage } from 'shared-utils'
import { Session } from 'next-auth'
import { BoardUserSharing } from '@prisma/client'

interface IHasUserPermissionOptions {
    session: Session
    boardId: string | null | undefined | false
    setError: (status: number, message: string) => false
}

export async function hasUserPermission(
    options: IHasUserPermissionOptions,
    permissionFn: (permission: BoardUserSharing | null) => boolean
) {
    const { session, boardId, setError } = options
    const permissionTable = await getUserPermissionTable(session)

    if (!boardId) return setError(400, ErrorMessage.BadRequest)

    const permissionRow = permissionTable.find(
        (permission) => permission.boardId === boardId
    )

    if (!permissionRow) return setError(403, ErrorMessage.Forbidden)

    const hasPermission = permissionFn(permissionRow)

    return hasPermission ? true : setError(403, ErrorMessage.Forbidden)
}
