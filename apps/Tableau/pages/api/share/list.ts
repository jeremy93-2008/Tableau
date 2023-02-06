import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const boardId = req.query.boardId as string

        if (!boardId)
            return res.status(400).send('No BoardId and UserId was provided')

        const result = await prisma.boardUserSharing.findMany({
            where: {
                boardId,
            },
            include: {
                board: true,
                user: true,
            },
        })

        res.json(result)
    })
}
