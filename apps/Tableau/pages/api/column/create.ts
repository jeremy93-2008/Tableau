import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { COLUMN_LIMIT, ErrorMessage } from 'shared-utils'
import { authOptions } from '../auth/[...nextauth]'
import { Procedure, withAuth } from 'shared-libs'
import { z } from 'zod'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { getUserPermissionTable } from '../../../lib/auth/getUserPermissionTable'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusName: z.string(),
    isDefault: z.boolean(),
    order: z.number(),
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
            const { id, statusName, order, isDefault } = params

            const result = await prisma.statusBoard.create({
                data: {
                    order,
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault },
                        },
                    },
                    board: {
                        connect: { id },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
