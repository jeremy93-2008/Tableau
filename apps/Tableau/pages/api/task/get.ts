import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchema>(req, res, schema)
    )
        .success(async (params) => {
            const { id } = params

            const result = await prisma.task.findFirst({
                where: {
                    id,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
