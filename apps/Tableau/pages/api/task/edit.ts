import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id
        const name = req.body.name
        const description = req.body.description
        const statusId = req.body.statusId
        const elapsedTime = req.body.elapsedTime
        const estimatedTime = req.body.estimatedTime

        if (req.method !== 'POST')
            return res
                .status(405)
                .send(
                    'Error: Method Not Allowed. Please use the POST method for this request.'
                )

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
    })
}
