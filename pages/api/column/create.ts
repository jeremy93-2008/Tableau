import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.body.id
    const statusName = req.body.statusName
    const isDefault = req.body.isDefault

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    const result = await prisma.status.upsert({
        create: {
            name: statusName,
            isDefault,
            Board: {
                connect: {
                    id,
                },
            },
        },
        update: {
            name: statusName,
            isDefault,
            Board: {
                connect: {
                    id,
                },
            },
        },
        where: {
            name: statusName,
        },
    })

    res.json(result)
}
