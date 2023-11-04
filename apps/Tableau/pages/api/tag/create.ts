import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    name: z.string(),
    color: z.string(),
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
            const { name, color, taskId } = params

            const isTagAlreadyExist = await prisma.tag.findFirst({
                where: {
                    name,
                    color,
                    taskId,
                },
            })

            if (isTagAlreadyExist)
                return res.status(400).json({ message: 'Tag already exist' })

            const result = await prisma.tag.create({
                data: {
                    name,
                    color,
                    task: {
                        connect: {
                            id: taskId,
                        },
                    },
                },
            })

            res.json(result)
        }
    )
}
