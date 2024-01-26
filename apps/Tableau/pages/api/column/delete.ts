import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { cleanOrder } from '../../../http/utils/cleanOrder'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string(),
    statusId: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, statusId } = context.data as ISchema
    const result = prisma.$transaction(async (tx) => {
        await prisma.task.deleteMany({ where: { status: { id } } })
        await prisma.statusBoard.delete({ where: { id } })

        //we reorder statusBoard with new order
        const allColumnsWithoutColumnDeleted =
            await prisma.statusBoard.findMany({
                where: { id: { not: id } },
            })
        const allColumnsWithCleanOrder = cleanOrder(
            allColumnsWithoutColumnDeleted
        )
        allColumnsWithCleanOrder.map((column) => {
            return prisma.statusBoard.update({
                where: { id: column.id },
                data: { order: column.order },
            })
        })

        //We check if status row based on statusName can be deleted
        if (
            (await prisma.statusBoard.count({
                where: { statusId },
            })) === 0
        )
            await prisma.status.delete({ where: { id: statusId } })
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.DeleteStatus],
        schema,
    }),
])
