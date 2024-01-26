import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getColumnPermission } from 'shared-libs'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { ValidationValueType } from '../../../http/providers/validation/validation.value.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { boardId } = context.data as ISchema

    const boardUserOfCurrentUser = await prisma.boardUserSharing.findFirst({
        where: {
            boardId,
            user: { email: context.session!.user!.email },
        },
    })

    const result = getColumnPermission(boardUserOfCurrentUser)

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [],
        requestDataType: ValidationValueType.Query,
        schema,
    }),
])
