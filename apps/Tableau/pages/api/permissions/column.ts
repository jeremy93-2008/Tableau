import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { getBoardPermission, getColumnPermission, withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res, session) => {
        const boardId = req.query.boardId as string

        if (!session.user || !session.user.email)
            return res.status(401).send('Unauthorized')
        if (!boardId) return res.status(400).send('Bad Request')

        const boardUserOfCurrentUser = await prisma.boardUserSharing.findFirst({
            where: {
                boardId,
                user: { email: session.user.email },
            },
        })

        const result = getColumnPermission(boardUserOfCurrentUser)

        res.json(result)
    })
}
