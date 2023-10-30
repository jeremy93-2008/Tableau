import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { getTaskPermission } from 'shared-libs'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { Session } from 'next-auth'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Get,
                permissions: [],
            },
            validations: { schema, valueType: ValidationValueType.Query },
        },
        async (_session, params) => {
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

            const result = getTaskPermission(boardUserOfCurrentUser)

            res.json(result)
        }
    )
}
