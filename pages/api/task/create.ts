import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const name = req.body.name
    const description = req.body.description
    const boardId = req.body.boardId
    const statusName = req.body.statusName

    const session = await getSession({ req })
    const email = session?.user?.email ?? ''

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    if (!session)
        return res
            .status(500)
            .send("The user are not logged in or doesn't exist")

    const result = await prisma.task.create({
        data: {
            name,
            description,
            elapsedTime: 0,
            estimatedTime: 0,
            board: {
                connect: {
                    id: boardId,
                },
            },
            status: {
                connect: {
                    name: statusName,
                },
            },
            user: {
                connect: {
                    email,
                },
            },
        },
    })

    res.json(result)
}
