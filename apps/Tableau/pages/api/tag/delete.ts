import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { getTaskPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchemaParams>(
            req,
            res,
            schema,
            {
                boardId: req.body.boardId,
                roleFn: getTaskPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { id } = params

            const result = await prisma.tag.delete({
                where: {
                    id,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
