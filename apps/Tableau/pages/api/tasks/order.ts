import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { entityMoveValidation } from '../column/move'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    tasks: z.array(entityMoveValidation),
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
                permissions: [PermissionPolicy.UpdateTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const orderedTasks = params.tasks
            const result = await prisma.$transaction(
                orderedTasks.map((task) => {
                    return prisma.task.update({
                        where: { id: task.id },
                        data: {
                            order: task.order,
                        },
                    })
                })
            )

            res.json(result)
        }
    )
}
