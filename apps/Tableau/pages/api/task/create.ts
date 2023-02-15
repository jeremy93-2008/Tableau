import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/database/prisma'
import { BOARD_LIMIT, ErrorMessage, TASK_LIMIT } from 'shared-utils'
import { authOptions } from '../auth/[...nextauth]'
import { Procedure, withAuth } from 'shared-libs'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { hasUserContentPermission } from '../../../lib/validation/hasUserContentPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    boardId: z.string().cuid(),
    statusId: z.string().cuid(),
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

                return hasUserContentPermission({
                    boardId: params.boardId,
                    session,
                    setError,
                })
            })
    )
        .success(async (params) => {
            const { boardId, statusId, description, name } = params
            const session = await isAuthenticated({ req, res, authOptions })
            if (!session) return
            const result = await prisma.task.create({
                data: {
                    name,
                    description,
                    elapsedTime: 0,
                    estimatedTime: 0,
                    board: {
                        connect: {
                            id: boardId,
                        },
                    },
                    status: {
                        connect: {
                            id: statusId,
                        },
                    },
                    user: {
                        connect: {
                            email: session.user!.email as string,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
