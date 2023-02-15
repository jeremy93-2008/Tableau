import { NextApiRequest, NextApiResponse } from 'next'
import { Procedure } from 'shared-libs'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'
import { z } from 'zod'
import { columnMoveValidation } from '../column/move'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.array(columnMoveValidation)

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

                const { id } = params[0]
                const currentStatusBoard = await prisma.statusBoard.findFirst({
                    where: { id: id },
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
            const orderedColumns = params
            const result = await prisma.$transaction(
                orderedColumns.map((column) => {
                    return prisma.statusBoard.update({
                        where: { id: column.id },
                        data: {
                            order: column.order,
                        },
                    })
                })
            )

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
