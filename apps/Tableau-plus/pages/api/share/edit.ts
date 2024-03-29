import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { editShareablePermissionCb, Procedure } from 'shared-libs'
import { hasPostMethod } from '../../../server/services/validation/hasPostMethod'
import { isAuthenticated } from '../../../server/services/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/api/Authenticate'

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
        await (
            await Authenticate.Post<typeof schema, ISchemaParams>(
                req,
                res,
                schema
            )
        ).checkAsync(async () => {
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
