import { NextApiRequest, NextApiResponse } from 'next'
import { ZodAny } from 'zod'
import { isAuthenticated } from './isAuthenticated'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { Procedure } from 'shared-libs'
import { hasGetMethod } from './validation/hasGetMethod'
import { checkValidRequest } from './services/checkValidRequest'

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

            return !!(await checkValidRequest({
                session,
                setError,
                params,
            }))
        })
}
