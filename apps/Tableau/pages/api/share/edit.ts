import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, canEditSchema, canEditContent } = context.data as ISchema
    const result = await prisma.boardUserSharing.update({
        where: { id },
        data: {
            canEditSchema: canEditSchema || false,
            canEditContent: canEditContent || false,
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateBoardUserSharing],
        schema,
    }),
])
