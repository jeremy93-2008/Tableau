import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getTaskPermission } from 'shared-libs'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    message: z.string(),
    userId: z.string().cuid(),
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
            const { message, taskId, userId } = params

            const result = await prisma.comment.create({
                data: {
                    message,
                    createdAt: new Date(),
                    task: {
                        connect: {
                            id: taskId,
                        },
                    },
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
