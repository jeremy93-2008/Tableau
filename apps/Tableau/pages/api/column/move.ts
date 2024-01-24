import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

export const entityMoveValidation = z.object({
    id: z.string(),
    order: z.number(),
})

const schema = z.object({
    boardId: z.string().cuid(),
    currentColumn: entityMoveValidation,
    affectedColumn: entityMoveValidation,
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
            const { currentColumn, affectedColumn } = params
            const result = prisma.$transaction([
                prisma.statusBoard.update({
                    where: { id: affectedColumn.id },
                    data: {
                        order: currentColumn.order,
                    },
                }),
                prisma.statusBoard.update({
                    where: { id: currentColumn.id },
                    data: {
                        order: affectedColumn.order,
                    },
                }),
            ])

            res.json(result)
        }
    )
}
