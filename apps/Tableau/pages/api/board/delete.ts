import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    userId: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.DeleteBoard],
            },
            validations: { schema, getBoardId: (params) => params.id },
        },
        async (_session, params) => {
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
        }
    )
}
