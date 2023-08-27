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
    order: z.number(),
    estimatedTime: z.number(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
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
                order,
                startDate,
                endDate,
                assignedUserIds,
            } = params

            const result = await prisma.$transaction(async (tx) => {
                await tx.task.update({
                    where: { id },
                    data: {
                        assignedUsers: { deleteMany: { taskId: id } },
                    },
                })

                if (!assignedUserIds) return

                return tx.task.update({
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
                        order,
                        startDate: startDate ? new Date(startDate) : null,
                        endDate: endDate ? new Date(endDate) : null,
                        assignedUsers: {
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
                        },
                    },
                })
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
