import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'
import { BOARD_LIMIT, TASK_LIMIT } from 'shared-utils'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const name = req.body.name
        const description = req.body.description
        const boardId = req.body.boardId
        const statusId = req.body.statusId

        const session = await getSession({ req })
        const email = session?.user?.email ?? ''

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        if (!session)
            return res
                .status(500)
                .send("The user are not logged in or doesn't exist")

        if (
            (await prisma.task.count({
                where: { user: { email }, boardId, statusId },
            })) > TASK_LIMIT
        )
            return res
                .status(500)
                .send(
                    'Task limit reached. You have reached the maximum number of Task (50). Please delete some existing task to create a new one.'
                )

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
                        id: statusId,
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
    })
}
