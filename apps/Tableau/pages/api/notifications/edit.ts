import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { notifications, isRead, isNew } = params

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
    )
}
