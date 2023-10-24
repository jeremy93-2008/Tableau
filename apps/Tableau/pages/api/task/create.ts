import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'
import { HistoryRepository } from '../../../app/repositories/history/history.repository'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

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
                http: HttpPolicy.Get,
                permissions: [PermissionPolicy.CreateTask],
            },
            validations: { schema, valueType: ValidationValueType.Body },
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
