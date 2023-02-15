import { NextApiRequest, NextApiResponse } from 'next'
import { Procedure, withAuth } from 'shared-libs'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { hasUserContentPermission } from '../../../lib/validation/hasUserContentPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    description: z.string(),
    statusId: z.string().cuid(),
    elapsedTime: z.number(),
    estimatedTime: z.number(),
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
                const currentTask = await prisma.task.findFirst({
                    where: { id },
                })

                if (!currentTask) return setError(400, ErrorMessage.BadRequest)

                return hasUserContentPermission({
                    boardId: currentTask.boardId,
                    session,
                    setError,
                })
            })
    )
        .success(async (params) => {
            const {
                id,
                name,
                description,
                elapsedTime,
                estimatedTime,
                statusId,
            } = params
            const result = await prisma.task.update({
                where: {
                    id,
                },
                data: {
                    name,
                    description,
                    elapsedTime: elapsedTime,
                    estimatedTime: estimatedTime,
                    status: {
                        connect: {
                            id: statusId,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
