import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { ValidationPolicy } from '../../../http/enums/validationPolicy'
import { IContext } from '../../../http/services/context'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    email: z.undefined() || z.string().email(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { boardId, email } = context.data as ISchema

    const result = await prisma.boardUserSharing.findMany({
        where: {
            boardId,
            user: { email },
        },
        include: {
            board: true,
            user: true,
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [PermissionPolicy.ReadBoardUserSharing],
        requestDataType: ValidationPolicy.Query,
        schema,
    }),
])
