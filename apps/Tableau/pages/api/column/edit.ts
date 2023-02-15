import { NextApiRequest, NextApiResponse } from 'next'
import { Procedure, withAuth } from 'shared-libs'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { z } from 'zod'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusName: z.string(),
    oldStatusName: z.string(),
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
            const { id, statusName, oldStatusName } = params
            const result = await prisma.statusBoard.update({
                where: {
                    id,
                },
                data: {
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault: false },
                        },
                    },
                },
            })

            //We check if status row based on statusName can be deleted
            if (
                (await prisma.statusBoard.count({
                    where: { status: { name: oldStatusName } },
                })) === 0
            )
                await prisma.status.delete({ where: { name: oldStatusName } })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
