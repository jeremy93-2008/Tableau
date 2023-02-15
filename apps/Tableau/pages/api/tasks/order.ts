import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { authOptions } from '../auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'
import { hasUserContentPermission } from '../../../lib/validation/hasUserContentPermission'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { Procedure } from 'shared-libs'
import { z } from 'zod'
import { columnMoveValidation } from '../column/move'

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
            const orderedTasks = params
            const result = await prisma.$transaction(
                orderedTasks.map((task) => {
                    return prisma.task.update({
                        where: { id: task.id },
                        data: {
                            order: task.order,
                        },
                    })
                })
            )

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
