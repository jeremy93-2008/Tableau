import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { IFullStatus } from '../../../types/types'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const currentColumn: IFullStatus = req.body.currentColumn
        const affectedColumn: IFullStatus = req.body.affectedColumn

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = prisma.$transaction([
            prisma.statusBoard.update({
                where: { id: affectedColumn.id },
                data: {
                    order: currentColumn.order,
                },
            }),
            prisma.statusBoard.update({
                where: { id: currentColumn.id },
                data: {
                    order: affectedColumn.order,
                },
            }),
        ])

        res.json(result)
    })
}
