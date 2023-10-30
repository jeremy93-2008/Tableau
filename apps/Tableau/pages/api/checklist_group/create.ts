import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    name: z.string().min(3),
    taskId: z.string(),
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
            const { name, taskId } = params

            const result = await prisma.checklistGroup.create({
                data: { name, taskId },
            })

            res.json(result)
        }
    )
}
