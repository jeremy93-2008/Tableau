import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { TaskHistoryMessageCode } from 'shared-utils'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { IContext } from '../../../http/services/context'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    messageCode: z.nativeEnum(TaskHistoryMessageCode),
    messageParams: z.record(z.string().trim().min(1), z.string().trim().min(1)),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, messageCode, messageParams } = context.data as ISchema

    const result = await prisma.history.update({
        where: { id },
        data: {
            messageCode,
            messageParams,
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
