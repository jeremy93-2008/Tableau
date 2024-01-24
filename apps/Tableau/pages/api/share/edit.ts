import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
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
                permissions: [PermissionPolicy.UpdateBoardUserSharing],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, canEditSchema, canEditContent } = params
            const result = await prisma.boardUserSharing.update({
                where: { id },
                data: {
                    canEditSchema: canEditSchema || false,
                    canEditContent: canEditContent || false,
                },
            })

            res.json(result)
        }
    )
}
