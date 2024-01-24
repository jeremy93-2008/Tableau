import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    userId: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const board = context.data as ISchema
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
}
export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.DeleteBoard],
        schema,
    }),
])
