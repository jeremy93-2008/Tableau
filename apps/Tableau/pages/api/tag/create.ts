import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { getTaskPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    name: z.string(),
    color: z.string(),
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
                boardId: req.body.boardId,
                roleFn: getTaskPermission,
                action: 'add',
            }
        )
    )
        .success(async (params) => {
            const { name, color, taskId } = params

            const isTagAlreadyExist = await prisma.tag.findFirst({
                where: {
                    name,
                    color,
                    taskId,
                },
            })

            if (isTagAlreadyExist)
                return res.status(400).json({ message: 'Tag already exist' })

            const result = await prisma.tag.create({
                data: {
                    name,
                    color,
                    task: {
                        connect: {
                            id: taskId,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
