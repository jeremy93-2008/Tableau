import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { Notification } from '../../../http/repositories/notification/notification.repository'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    message: z.string().trim().min(1),
    email: z.string().email(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { message, taskId, email } = context.data as ISchema

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
        await Notification.add(
            'info',
            `New comment "_${message}_" of __${currentUser?.name}__ on task __${selectedTask?.name}__`,
            assignedUsers
                .map((assignedUser) => assignedUser.User.email ?? '')
                .filter((email) => email && email !== currentUser?.email)
        )
    }

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateTask],
        schema,
    }),
])
