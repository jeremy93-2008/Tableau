import { NextApiRequest, NextApiResponse } from 'next'
import { Procedure } from 'shared-libs'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { z } from 'zod'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { getUserPermissionTable } from '../../../lib/auth/getUserPermissionTable'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    userId: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Procedure<ISchemaParams>({ req })
            .input((req) => {
                return schema.safeParse(req.body)
            })
            .check(hasPostMethod(req))
            .checkAsync(async (params, setError) => {
                const session = await isAuthenticated({ req, res, authOptions })

                if (!session) return setError(401, ErrorMessage.Unauthorized)
                if (!params) return setError(400, ErrorMessage.BadRequest)

                return hasUserSchemaPermission({
                    session,
                    setError,
                    boardId: params.id,
                })
            })
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
