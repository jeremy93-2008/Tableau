import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

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

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { currentColumn, affectedColumn } = context.data as ISchema
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

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateStatus],
        schema,
    }),
])
