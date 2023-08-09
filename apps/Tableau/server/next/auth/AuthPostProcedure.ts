import { NextApiRequest, NextApiResponse } from 'next'
import { ZodAny } from 'zod'
import { hasPostMethod } from './validation/hasPostMethod'
import { isAuthenticated } from './isAuthenticated'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { Procedure } from 'shared-libs'
import { checkValidRequest } from './services/checkValidRequest'

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

            return !!(await checkValidRequest({
                session,
                setError,
                params,
            }))
        })
}
