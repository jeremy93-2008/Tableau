import { NextApiRequest, NextApiResponse } from 'next'
import { Procedure } from 'shared-libs'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'
import { z } from 'zod'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

export const columnMoveValidation = z.object({
    id: z.string(),
    order: z.number(),
})

const schema = z.object({
    currentColumn: columnMoveValidation,
    affectedColumn: columnMoveValidation,
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

                const { currentColumn } = params
                const currentStatusBoard = await prisma.statusBoard.findFirst({
                    where: { id: currentColumn.id },
                })

                if (!currentStatusBoard)
                    return setError(400, ErrorMessage.BadRequest)

                return hasUserSchemaPermission({
                    boardId: currentStatusBoard.boardId,
                    session,
                    setError,
                })
            })
    )
        .success(async (params) => {
            const { currentColumn, affectedColumn } = params
            const result = prisma.$transaction([
                prisma.statusBoard.update({
                    where: { id: affectedColumn.id },
                    data: {
                        order: currentColumn.order,
                    },
                }),
                prisma.statusBoard.update({
                    where: { id: currentColumn.id },
                    data: {
                        order: affectedColumn.order,
                    },
                }),
            ])

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
