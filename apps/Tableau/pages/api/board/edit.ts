import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { Procedure } from 'shared-libs'
import { authOptions } from '../auth/[...nextauth]'
import { z } from 'zod'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { getUserPermissionTable } from '../../../lib/auth/getUserPermissionTable'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { hasUserSchemaPermission } from '../../../lib/validation/hasUserSchemaPermission'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    backgroundUrl: z.string(),
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
            const { id, name, description, backgroundUrl } = params
            const result = await prisma.board.update({
                where: { id },
                data: {
                    name,
                    description,
                    backgroundUrl,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
