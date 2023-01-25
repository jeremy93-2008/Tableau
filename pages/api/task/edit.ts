import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.body.id
    const name = req.body.name
    const description = req.body.description
    const statusId = req.body.statusId
    const elapsedTime = req.body.elapsedTime
    const estimatedTime = req.body.estimatedTime

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    const result = await prisma.task.update({
        where: {
            id,
        },
        data: {
            name,
            description,
            elapsedTime: elapsedTime,
            estimatedTime: estimatedTime,
            status: {
                connect: {
                    id: statusId,
                },
            },
        },
    })

    res.json(result)
}
