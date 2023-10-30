import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { editShareablePermissionCb, Procedure } from 'shared-libs'
import { hasPostMethod } from '../../../server/next/auth/validation/hasPostMethod'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchema = z.infer<typeof schema>

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
            await Authenticate.Post<typeof schema, ISchema>(req, res, schema)
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
