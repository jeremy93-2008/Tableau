import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string(),
    statusName: z.string(),
    isDefault: z.boolean(),
    order: z.number(),
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
                permissions: [PermissionPolicy.CreateStatus],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, statusName, order, isDefault } = params

            const result = await prisma.statusBoard.create({
                data: {
                    order,
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault },
                        },
                    },
                    board: {
                        connect: { id },
                    },
                },
            })

            res.json(result)
        }
    )
}
