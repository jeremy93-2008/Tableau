import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { getTaskPermission } from 'shared-libs'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    isRead: z.boolean().nullable(),
    isNew: z.boolean().nullable(),
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
            const { id, isNew, isRead } = params

            const result = await prisma.notification.update({
                where: { id },
                data: {
                    isRead: isRead ?? undefined,
                    isNew: isNew ?? undefined,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
