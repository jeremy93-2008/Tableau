import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { IBoardWithAllRelation } from '../../../types/types'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const board = req.body as IBoardWithAllRelation

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const results = await prisma.$transaction([
            prisma.task.deleteMany({ where: { board: { id: board.id } } }),
            prisma.statusBoard.deleteMany({
                where: { board: { id: board.id } },
            }),
            prisma.boardUserSharing.delete({
                where: {
                    boardId_userId: { userId: board.userId, boardId: board.id },
                },
            }),
            prisma.board.delete({ where: { id: board.id } }),
        ])

        res.json(results)
    })
}
