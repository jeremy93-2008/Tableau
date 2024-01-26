import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { ValidationValueType } from '../../../http/providers/validation/validation.value.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id } = context.data as ISchema

    const result = await prisma.task.findFirst({
        where: {
            id,
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [PermissionPolicy.ReadTask],
        requestDataType: ValidationValueType.Query,
        schema,
    }),
])
