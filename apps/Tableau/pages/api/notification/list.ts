import { NextApiRequest, NextApiResponse } from 'next'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    email: z.string().email(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { email } = params

            const result = await prisma.notification.findMany({
                where: {
                    Users: {
                        some: { email },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
