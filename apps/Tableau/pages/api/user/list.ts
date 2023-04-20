import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async () => {
            const result = await prisma.user.findMany({
                include: { accounts: true, sessions: true },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
