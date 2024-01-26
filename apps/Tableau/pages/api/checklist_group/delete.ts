import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    boardId: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id } = context.data as ISchema

    const result = await prisma.checklistGroup.delete({
        where: { id },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.DeleteTask],
        schema,
    }),
])
