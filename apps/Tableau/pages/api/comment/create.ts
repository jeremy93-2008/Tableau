import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { NotificationRepository } from '../../../http/repositories/notification/notification.repository'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

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
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.UpdateTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
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
        }
    )
}
