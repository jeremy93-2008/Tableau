import { getUserPermissionTable } from '../auth/getUserPermissionTable'
import { ErrorMessage } from 'shared-utils'
import { Session } from 'next-auth'

interface IHasUserSchemaPermissionOptions {
    session: Session
    boardId: string
    setError: (status: number, message: string) => false
}

export async function hasUserSchemaPermission(
    options: IHasUserSchemaPermissionOptions
) {
    const { session, boardId, setError } = options
    const permissionTable = await getUserPermissionTable(session)
    const hasPermission =
        permissionTable.find((permission) => permission.boardId === boardId)
            ?.canEditSchema ?? false

    if (!hasPermission) return setError(403, ErrorMessage.Forbidden)
    return hasPermission
}
