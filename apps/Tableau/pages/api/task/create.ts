import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    boardId: z.string().cuid(),
    statusId: z.string().cuid(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { boardId, statusId, description, name } = context.data as ISchema

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
                    email: context.session!.user!.email as string,
                },
            },
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.CreateTask],
        schema,
    }),
])
