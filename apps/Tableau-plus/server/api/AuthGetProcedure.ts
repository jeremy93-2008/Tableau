import { NextApiRequest, NextApiResponse } from 'next'
import { ZodAny } from 'zod'
import { isAuthenticated } from '../services/auth/isAuthenticated'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'
import { Procedure } from 'shared-libs'
import { hasGetMethod } from '../services/validation/hasGetMethod'

export async function AuthGetProcedure<ISchema, ISchemaValueParams>(
    req: NextApiRequest,
    res: NextApiResponse,
    schema: ISchema
) {
    return await Procedure<ISchemaValueParams>({ req })
        .input((req) => {
            return (schema as ZodAny).safeParse(req.query)
        })
        .check(hasGetMethod(req))
        .checkAsync(async (params, setError) => {
            const session = await isAuthenticated({ req, res, authOptions })

            if (!session) return setError(401, ErrorMessage.Unauthorized)
            if (params == null) return setError(400, ErrorMessage.BadRequest)

            return true
        })
}
