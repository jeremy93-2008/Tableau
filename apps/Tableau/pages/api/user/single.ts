import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { ValidationPolicy } from '../../../http/enums/validationPolicy'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid().nullable(),
    email: z.string().email().nullable(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const params = context.data as ISchema
    const result = await prisma.user.findMany({
        where: {
            OR: [{ id: params.id ?? '' }, { email: params.email ?? '' }],
        },
        include: { accounts: true, sessions: true },
    })

    res.json(result[0])
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [PermissionPolicy.ReadBoardList],
        requestDataType: ValidationPolicy.Query,
        schema,
    }),
])
