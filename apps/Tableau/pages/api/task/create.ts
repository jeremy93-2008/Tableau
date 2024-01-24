import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'
import { HistoryRepository } from '../../../http/repositories/history/history.repository'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

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
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.CreateTask],
            },
            validations: { schema },
        },
        async (session, params) => {
            const { boardId, statusId, description, name } = params
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
        }
    )
}
