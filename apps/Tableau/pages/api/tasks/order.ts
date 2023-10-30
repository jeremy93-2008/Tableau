import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { columnMoveValidation } from '../column/move'
import { getBoardIdFromTaskId } from '../../../server/prisma/getBoardIdFromTaskId'
import { getTaskPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchema = z.infer<typeof schema>

const schema = z.array(columnMoveValidation)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchema>(
            req,
            res,
            schema,
            {
                boardId: await getBoardIdFromTaskId(req.body[0].id),
                roleFn: getTaskPermission,
                action: 'move',
            }
        )
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
