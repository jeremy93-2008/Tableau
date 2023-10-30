import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    boardId: z.string(),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    checked: z.optional(z.boolean()),
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
            const { id, name, checked } = params

            const result = await prisma.checklist.update({
                where: { id },
                data: {
                    name: name ?? undefined,
                    checked: checked ?? undefined,
                },
            })

            res.json(result)
        }
    )
}
