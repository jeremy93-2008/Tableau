import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { getBoardIdFromTaskId } from '../../../server/prisma/getBoardIdFromTaskId'
import { getTaskPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    description: z.string(),
    statusId: z.string().cuid(),
    elapsedTime: z.number(),
    estimatedTime: z.number(),
    assignedUserIds: z.array(z.string()).nullable(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchemaParams>(
            req,
            res,
            schema,
            {
                boardId: await getBoardIdFromTaskId(req.body.id),
                roleFn: getTaskPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const {
                id,
                name,
                description,
                elapsedTime,
                estimatedTime,
                statusId,
                assignedUserIds,
            } = params

            const assignedUsersValues = assignedUserIds
                ? {
                      connectOrCreate: assignedUserIds.map((userId) => {
                          return {
                              where: {
                                  taskId_userId: { userId, taskId: id },
                              },
                              create: {
                                  userId,
                                  isHolder: false,
                              },
                          }
                      }),
                  }
                : undefined

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
                    assignedUsers: assignedUsersValues,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
