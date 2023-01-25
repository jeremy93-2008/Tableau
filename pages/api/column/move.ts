import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { IFullStatus } from '../../../types/types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const currentColumn: IFullStatus = req.body.currentColumn
    const affectedColumn: IFullStatus = req.body.affectedColumn

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    await prisma.statusBoard.update({
        where: { id: affectedColumn.id },
        data: {
            order: currentColumn.order,
        },
    })

    const result = await prisma.statusBoard.update({
        where: { id: currentColumn.id },
        data: {
            order: affectedColumn.order,
        },
    })

    res.json(result)
}
