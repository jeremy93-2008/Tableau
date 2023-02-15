import { getUserPermissionTable } from '../auth/getUserPermissionTable'
import { ErrorMessage } from 'shared-utils'
import { Session } from 'next-auth'

interface IHasUserContentPermissionOptions {
    session: Session
    boardId: string
    setError: (status: number, message: string) => false
}

export async function hasUserContentPermission(
    options: IHasUserContentPermissionOptions
) {
    const { session, boardId, setError } = options
    const permissionTable = await getUserPermissionTable(session)
    const hasPermission =
        permissionTable.find((permission) => permission.boardId === boardId)
            ?.canEditContent ?? false

    if (!hasPermission) return setError(403, ErrorMessage.Forbidden)
    return hasPermission
}
