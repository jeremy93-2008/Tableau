import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    boardId: z.string(),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    checked: z.optional(z.boolean()),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, name, checked } = context.data as ISchema

    const result = await prisma.checklist.update({
        where: { id },
        data: {
            name: name ?? undefined,
            checked: checked ?? undefined,
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
