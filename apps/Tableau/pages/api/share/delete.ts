import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { deleteShareablePermissionCb } from 'shared-libs'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
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
            return deleteShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
            })
        })
    )
        .success(async (params) => {
            const { id } = params
            const result = await prisma.boardUserSharing.delete({
                where: { id },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
