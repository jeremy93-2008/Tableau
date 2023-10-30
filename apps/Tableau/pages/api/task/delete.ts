import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { getTaskPermission } from 'shared-libs'
import { getBoardIdFromTaskId } from '../../../server/prisma/getBoardIdFromTaskId'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchema>(
            req,
            res,
            schema,
            {
                boardId: await getBoardIdFromTaskId(req.body.id),
                roleFn: getTaskPermission,
                action: 'delete',
            }
        )
    )
        .success(async (params) => {
            const { id } = params
            const result = await prisma.task.delete({ where: { id } })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
