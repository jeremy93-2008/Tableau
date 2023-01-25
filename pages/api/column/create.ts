import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.body.id
    const statusName = req.body.statusName
    const isDefault = req.body.isDefault
    const order = req.body.order

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

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
