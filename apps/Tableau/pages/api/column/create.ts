import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { COLUMN_LIMIT } from 'shared-utils'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id
        const statusName = req.body.statusName
        const isDefault = req.body.isDefault
        const order = req.body.order

        if (req.method !== 'POST')
            return res
                .status(405)
                .send(
                    'Error: Method Not Allowed. Please use the POST method for this request.'
                )

        if (
            (await prisma.statusBoard.count({ where: { boardId: id } })) >
            COLUMN_LIMIT
        )
            return res
                .status(500)
                .send(
                    'Column limit reached. You have reached the maximum number of columns (20). Please delete some existing columns to create a new one.'
                )

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
    })
}
