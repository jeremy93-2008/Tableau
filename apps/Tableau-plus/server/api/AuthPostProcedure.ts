import { NextApiRequest, NextApiResponse } from 'next'
import { ZodAny } from 'zod'
import { hasPostMethod } from '../services/validation/hasPostMethod'
import { isAuthenticated } from '../services/auth/isAuthenticated'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'
import { getBoardPermission, IKeyPermission, Procedure } from 'shared-libs'
import { hasUserPermission } from '../services/validation/hasUserPermission'

export async function AuthPostProcedure<ISchema, ISchemaValueParams>(
    req: NextApiRequest,
    res: NextApiResponse,
    schema: ISchema
) {
    return await Procedure<ISchemaValueParams>({ req })
        .input((req) => {
            return (schema as ZodAny).safeParse(req.body)
        })
        .check(hasPostMethod(req))
        .checkAsync(async (params, setError) => {
            const session = await isAuthenticated({ req, res, authOptions })

            if (!session) return setError(401, ErrorMessage.Unauthorized)
            if (!params) return setError(400, ErrorMessage.BadRequest)

            return true
        })
}
