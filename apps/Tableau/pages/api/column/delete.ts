import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { cleanOrder } from '../../../lib/cleanOrder'
import { authOptions } from '../auth/[...nextauth]'
import { Procedure } from 'shared-libs'
import { z } from 'zod'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusId: z.string(),
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

                const { id } = params
                const currentStatusBoard = await prisma.statusBoard.findFirst({
                    where: { id },
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
            const { id, statusId } = params
            const result = prisma.$transaction(async (tx) => {
                await prisma.task.deleteMany({ where: { status: { id } } })
                await prisma.statusBoard.delete({ where: { id } })

                //we reorder statusBoard with new order
                const allColumnsWithoutColumnDeleted =
                    await prisma.statusBoard.findMany({
                        where: { id: { not: id } },
                    })
                const allColumnsWithCleanOrder = cleanOrder(
                    allColumnsWithoutColumnDeleted
                )
                allColumnsWithCleanOrder.map((column) => {
                    return prisma.statusBoard.update({
                        where: { id: column.id },
                        data: { order: column.order },
                    })
                })

                //We check if status row based on statusName can be deleted
                if (
                    (await prisma.statusBoard.count({
                        where: { statusId },
                    })) === 0
                )
                    await prisma.status.delete({ where: { id: statusId } })
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
