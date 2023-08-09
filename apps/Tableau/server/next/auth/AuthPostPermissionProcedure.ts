import { NextApiRequest, NextApiResponse } from 'next'
import { ZodAny } from 'zod'
import { hasPostMethod } from './validation/hasPostMethod'
import { isAuthenticated } from './isAuthenticated'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { getBoardPermission, IKeyPermission, Procedure } from 'shared-libs'
import { hasUserPermission } from './validation/hasUserPermission'
import { checkValidRequest } from './services/checkValidRequest'
import { Session } from 'next-auth'

export async function AuthPostPermissionProcedure<ISchema, ISchemaValueParams>(
    req: NextApiRequest,
    res: NextApiResponse,
    schema: ISchema,
    permission: {
        roleFn: typeof getBoardPermission
        action: IKeyPermission
        boardId: string | false
    }
) {
    return await Procedure<ISchemaValueParams>({ req })
        .input((req) => {
            return (schema as ZodAny).safeParse(req.body)
        })
        .check(hasPostMethod(req))
        .checkAsync(async (params, setError) => {
            const session = await isAuthenticated({ req, res, authOptions })

            await checkValidRequest({
                session,
                setError,
                params,
            })

            return await hasUserPermission(
                {
                    session: session as Session,
                    setError,
                    boardId: permission.boardId,
                },
                (permissionRow) =>
                    permission.roleFn(permissionRow)[permission.action]
            )
        })
}
