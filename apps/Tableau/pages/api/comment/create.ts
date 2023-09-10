import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getTaskPermission } from 'shared-libs'
import { NotificationRepository } from '../../../app/repositories/notification/notification.repository'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    message: z.string().trim().min(1),
    email: z.string().email(),
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
                boardId: req.body.boardId,
                roleFn: getTaskPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { message, taskId, email } = params

            const result = await prisma.comment.create({
                data: {
                    message,
                    createdAt: new Date(),
                    task: {
                        connect: {
                            id: taskId,
                        },
                    },
                    user: {
                        connect: {
                            email,
                        },
                    },
                },
            })

            const currentUser = await prisma.user.findFirst({
                where: {
                    email,
                },
            })

            const selectedTask = await prisma.task.findFirst({
                where: {
                    id: taskId,
                },
            })

            const assignedUsers = await prisma.taskAssignedUser.findMany({
                where: {
                    taskId,
                },
                include: {
                    User: true,
                },
            })

            if (assignedUsers && assignedUsers.length > 0) {
                const notification = new NotificationRepository()
                await notification.add(
                    'info',
                    `New comment "_${message}_" of __${currentUser?.name}__ on task __${selectedTask?.name}__`,
                    assignedUsers
                        .map((assignedUser) => assignedUser.User.email ?? '')
                        .filter(
                            (email) => email && email !== currentUser?.email
                        )
                )
            }

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
