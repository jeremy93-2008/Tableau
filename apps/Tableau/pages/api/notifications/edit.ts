import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    notifications: z.array(
        z.object({
            id: z.string().cuid(),
        })
    ),
    isRead: z.boolean().nullable(),
    isNew: z.boolean().nullable(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { notifications, isRead, isNew } = context.data as ISchema

    const result = await prisma.notification.updateMany({
        where: {
            id: { in: notifications.map((n) => n.id) },
        },
        data: {
            isRead: isRead ?? undefined,
            isNew: isNew ?? undefined,
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [],
        schema,
    }),
])
