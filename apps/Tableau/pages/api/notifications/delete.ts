import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/enums/http.enum'
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
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { notifications } = context.data as ISchema

    const result = await prisma.notification.deleteMany({
        where: {
            id: { in: notifications.map((n) => n.id) },
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
