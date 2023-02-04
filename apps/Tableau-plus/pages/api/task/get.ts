import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.body.id

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    const result = await prisma.task.findFirst({
        where: {
            id,
        },
    })

    res.json(result)
}
