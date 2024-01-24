import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { HttpPolicy } from '../../../http/providers/http/http.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    boardId: z.string(),
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
                permissions: [PermissionPolicy.DeleteTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id } = params

            const result = await prisma.checklistGroup.delete({
                where: { id },
            })

            res.json(result)
        }
    )
}
