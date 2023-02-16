import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    email: z.undefined() || z.string().email(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { boardId, email } = params

            const result = await prisma.boardUserSharing.findMany({
                where: {
                    boardId,
                    user: { email },
                },
                include: {
                    board: true,
                    user: true,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
