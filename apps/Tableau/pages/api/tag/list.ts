import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    taskId: z.string().cuid().optional(),
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
                permissions: [PermissionPolicy.ReadTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const result = await prisma.tag.findMany({
                where: {
                    task: {
                        id:
                            params && params.taskId !== null
                                ? params.taskId
                                : undefined,
                    },
                },
            })

            res.json(result)
        }
    )
}
