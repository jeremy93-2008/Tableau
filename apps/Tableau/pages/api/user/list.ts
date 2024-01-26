import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { ValidationValueType } from '../../../http/providers/validation/validation.value.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    _context: IContext
) {
    const result = await prisma.user.findMany({
        include: { accounts: true, sessions: true },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [PermissionPolicy.ReadBoardList],
        requestDataType: ValidationValueType.Query,
        schema,
    }),
])
