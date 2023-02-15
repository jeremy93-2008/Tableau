import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { editShareablePermissionCb, Procedure } from 'shared-libs'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Procedure<ISchemaParams>({ req })
            .input((req) => {
                return schema.safeParse(req.body)
            })
            .check(hasPostMethod(req))
            .checkAsync(async (params, setError) => {
                const session = await isAuthenticated({ req, res, authOptions })

                if (!session) return setError(401, ErrorMessage.Unauthorized)
                if (!params) return setError(400, ErrorMessage.BadRequest)

                return editShareablePermissionCb({
                    req,
                    res,
                    authOptions,
                    prisma,
                })
            })
    )
        .success(async (params) => {
            const { id, canEditSchema, canEditContent } = params
            const result = await prisma.boardUserSharing.update({
                where: { id },
                data: {
                    canEditSchema: canEditSchema || false,
                    canEditContent: canEditContent || false,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
