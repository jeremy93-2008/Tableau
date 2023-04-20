import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { getColumnPermission } from 'shared-libs'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { Session } from 'next-auth'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { boardId } = params

            const session = (await isAuthenticated({
                req,
                res,
                authOptions,
            })) as Session

            const boardUserOfCurrentUser =
                await prisma.boardUserSharing.findFirst({
                    where: {
                        boardId,
                        user: { email: session.user!.email },
                    },
                })

            const result = getColumnPermission(boardUserOfCurrentUser)

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
