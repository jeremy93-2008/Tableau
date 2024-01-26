import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
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
