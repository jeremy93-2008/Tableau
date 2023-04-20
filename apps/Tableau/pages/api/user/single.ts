import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid().nullable(),
    email: z.string().email().nullable(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const result = await prisma.user.findMany({
                where: {
                    OR: [
                        { id: params.id ?? '' },
                        { email: params.email ?? '' },
                    ],
                },
                include: { accounts: true, sessions: true },
            })

            res.json(result[0])
        })
        .catch((errors) => onCallExceptions(res, errors))
}
