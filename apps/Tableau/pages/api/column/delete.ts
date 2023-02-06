import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { cleanOrder } from '../../../lib/cleanOrder'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id
        const statusId = req.body.statusId

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

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
            if ((await prisma.statusBoard.count({ where: { statusId } })) === 0)
                await prisma.status.delete({ where: { id: statusId } })
        })

        res.json(result)
    })
}
