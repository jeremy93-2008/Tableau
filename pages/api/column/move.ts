import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.body.id
    const prevOrder = req.body.prevOrder
    const nextOrder = req.body.nextOrder

    const prevStatusBoard = await prisma.statusBoard.findFirst({
        where: { order: nextOrder },
    })

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    if (prevStatusBoard) {
        await prisma.statusBoard.update({
            where: { id: prevStatusBoard.id },
            data: {
                order: prevOrder,
            },
        })
    }

    const result = await prisma.statusBoard.update({
        where: { id },
        data: {
            order: nextOrder,
        },
    })

    res.json(result)
}
