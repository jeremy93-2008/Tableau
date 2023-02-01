import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { IBoardWithAllRelation } from '../../../types/types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const board = req.body as IBoardWithAllRelation

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    const results = await prisma.$transaction([
        prisma.task.deleteMany({ where: { board: { id: board.id } } }),
        prisma.statusBoard.deleteMany({ where: { board: { id: board.id } } }),
        prisma.board.delete({ where: { id: board.id } }),
    ])

    res.json(results)
}