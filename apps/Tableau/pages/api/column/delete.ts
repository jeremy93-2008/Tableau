import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { cleanOrder } from '../../../server/utils/cleanOrder'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusId: z.string(),
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
                permissions: [PermissionPolicy.DeleteStatus],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, statusId } = params
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
    )
}
