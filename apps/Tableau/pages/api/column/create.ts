import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string(),
    statusName: z.string(),
    isDefault: z.boolean(),
    order: z.number(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, statusName, order, isDefault } = context.data as ISchema

    const result = await prisma.statusBoard.create({
        data: {
            order,
            status: {
                connectOrCreate: {
                    where: { name: statusName },
                    create: { name: statusName, isDefault },
                },
            },
            board: {
                connect: { id },
            },
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.CreateStatus],
        schema,
    }),
])
