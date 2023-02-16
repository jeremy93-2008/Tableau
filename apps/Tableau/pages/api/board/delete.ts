import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { getBoardPermission } from 'shared-libs'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    userId: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    ;(
        await Authenticate.Permission.Post<typeof schema, ISchemaParams>(
            req,
            res,
            schema,
            {
                boardId: req.body.id,
                roleFn: getBoardPermission,
                action: 'delete',
            }
        )
    )
        .success(async (params) => {
            const board = params
            const results = await prisma.$transaction([
                prisma.task.deleteMany({
                    where: { board: { id: board.id } },
                }),
                prisma.statusBoard.deleteMany({
                    where: { board: { id: board.id } },
                }),
                prisma.boardUserSharing.delete({
                    where: {
                        boardId_userId: {
                            userId: board.userId,
                            boardId: board.id,
                        },
                    },
                }),
                prisma.board.delete({ where: { id: board.id } }),
            ])

            res.json(results)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
