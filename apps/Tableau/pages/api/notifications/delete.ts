import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    notifications: z.array(
        z.object({
            id: z.string().cuid(),
        })
    ),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Post<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { notifications } = params

            const result = await prisma.notification.deleteMany({
                where: {
                    id: { in: notifications.map((n) => n.id) },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
