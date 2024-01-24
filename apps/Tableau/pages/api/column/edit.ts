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
    oldStatusName: z.string(),
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
                permissions: [PermissionPolicy.UpdateStatus],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, statusName, oldStatusName } = params
            const result = await prisma.statusBoard.update({
                where: {
                    id,
                },
                data: {
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault: false },
                        },
                    },
                },
            })

            //We check if status row based on statusName can be deleted
            if (
                (await prisma.statusBoard.count({
                    where: { status: { name: oldStatusName } },
                })) === 0
            )
                await prisma.status.delete({ where: { name: oldStatusName } })

            res.json(result)
        }
    )
}
