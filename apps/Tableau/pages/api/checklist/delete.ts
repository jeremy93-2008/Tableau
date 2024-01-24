import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
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

            const result = await prisma.checklist.delete({
                where: { id },
            })

            res.json(result)
        }
    )
}
