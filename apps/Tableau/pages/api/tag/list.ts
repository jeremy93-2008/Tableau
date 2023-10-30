import { NextApiRequest, NextApiResponse } from 'next'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    taskId: z.string().cuid().optional(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchema>(req, res, schema)
    )
        .success(async (params) => {
            const result = await prisma.tag.findMany({
                where: {
                    task: {
                        id:
                            params && params.taskId !== null
                                ? params.taskId
                                : undefined,
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
