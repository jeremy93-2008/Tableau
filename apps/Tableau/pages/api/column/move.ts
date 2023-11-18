import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

export const columnMoveValidation = z.object({
    id: z.string(),
    order: z.number(),
})

const schema = z.object({
    currentColumn: columnMoveValidation,
    affectedColumn: columnMoveValidation,
})

//TODO: Add boardId to the schema
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
