import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    message: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, message } = context.data as ISchema

    const result = await prisma.comment.update({
        where: { id },
        data: {
            message,
            createdAt: new Date(),
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateTask],
        schema,
    }),
])
