import { NextApiRequest, NextApiResponse } from 'next'
import { Task } from '.prisma/client'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const orderedTasks: Task[] = req.body

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    const result = await prisma.$transaction(
        orderedTasks.map((task) => {
            return prisma.task.update({
                where: { id: task.id },
                data: {
                    order: task.order,
                },
            })
        })
    )

    res.json(result)
}
