import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { getTaskPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'
import { HistoryRepository } from '../../../app/repositories/history/history.repository'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    boardId: z.string().cuid(),
    statusId: z.string().cuid(),
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
                action: 'add',
            }
        )
    )
        .success(async (params) => {
            const { boardId, statusId, description, name } = params
            const session = await isAuthenticated({ req, res, authOptions })
            if (!session) return
            const result = await prisma.task.create({
                data: {
                    name,
                    description,
                    elapsedTime: 0,
                    estimatedTime: 0,
                    order: await prisma.task.count({
                        where: { boardId, statusId },
                    }),
                    board: {
                        connect: {
                            id: boardId,
                        },
                    },
                    status: {
                        connect: {
                            id: statusId,
                        },
                    },
                    user: {
                        connect: {
                            email: session.user!.email as string,
                        },
                    },
                },
            })

            const history = new HistoryRepository()
            history.add({
                taskId: result.id,
                code: TaskHistoryMessageCode.TaskCreated,
                params: {
                    taskName: result.name,
                },
                email: session.user!.email as string,
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
