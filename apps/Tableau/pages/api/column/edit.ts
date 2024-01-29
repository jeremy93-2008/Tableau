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
    boardId: z.string().cuid(),
    id: z.string(),
    statusName: z.string(),
    oldStatusName: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, statusName, oldStatusName } = context.data as ISchema
    const result = await prisma.statusBoard.update({
        where: {
            id,
        },
        data: {
            status: {
                connectOrCreate: {
                    where: { name: statusName },
                    create: { name: statusName, isDefault: false },
                },
            },
        },
    })

    //We check if status row based on statusName can be deleted
    if (
        (await prisma.statusBoard.count({
            where: { status: { name: oldStatusName } },
        })) === 0
    )
        await prisma.status.delete({ where: { name: oldStatusName } })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateStatus],
        schema,
    }),
])
