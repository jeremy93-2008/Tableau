import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { IFullStatus } from '../../../types/types'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const orderedColumns: IFullStatus[] = req.body

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = await prisma.$transaction(
            orderedColumns.map((column) => {
                return prisma.statusBoard.update({
                    where: { id: column.id },
                    data: {
                        order: column.order,
                    },
                })
            })
        )

        res.json(result)
    })
}
