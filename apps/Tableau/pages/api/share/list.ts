import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const boardId = req.query.boardId as string
        const email = req.query.email as string

        if (!boardId)
            return res.status(400).send('No BoardId and UserId was provided')

        const result = await prisma.boardUserSharing.findMany({
            where: {
                boardId,
                user: { email },
            },
            include: {
                board: true,
                user: true,
            },
        })

        res.json(result)
    })
}
