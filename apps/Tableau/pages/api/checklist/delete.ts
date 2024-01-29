import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { IContext } from '../../../http/services/context'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    boardId: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id } = context.data as ISchema

    const result = await prisma.checklist.delete({
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
