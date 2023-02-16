import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { cleanOrder } from '../../../server/utils/cleanOrder'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { getColumnPermission } from 'shared-libs'
import { getBoardIdFromStatusId } from '../../../server/prisma/getBoardIdFromStatusId'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusId: z.string(),
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
                boardId: await getBoardIdFromStatusId(req.body.id),
                roleFn: getColumnPermission,
                action: 'delete',
            }
        )
    )
        .success(async (params) => {
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
        })
        .catch((errors) => onCallExceptions(res, errors))
}
