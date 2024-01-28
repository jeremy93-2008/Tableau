import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
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

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
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
    } = context.data as ISchema

    const task = await prisma.task.findUnique({
        where: { id },
    })

    if (!task) {
        return res.status(404).json({ message: 'Task not found' })
    }

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
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateTask],
        schema,
    }),
])
