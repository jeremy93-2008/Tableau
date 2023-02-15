import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { addShareablePermissionCb, Procedure } from 'shared-libs'
import { hasPostMethod } from '../../../lib/validation/hasPostMethod'
import { isAuthenticated } from '../../../lib/auth/isAuthenticated'
import { ErrorMessage } from 'shared-utils'
import { onCallExceptions } from '../../../lib/exceptions/onCallExceptions'
import { z } from 'zod'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    email: z.string().email(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Procedure<ISchemaParams>({ req })
            .input((req) => {
                return schema.safeParse(req.body)
            })
            .check(hasPostMethod(req))
            .checkAsync(async (params, setError) => {
                const session = await isAuthenticated({ req, res, authOptions })

                if (!session) return setError(401, ErrorMessage.Unauthorized)
                if (!params) return setError(400, ErrorMessage.BadRequest)

                return addShareablePermissionCb({
                    req,
                    res,
                    authOptions,
                    prisma,
                })
            })
    )
        .success(async (params) => {
            const { boardId, email, canEditSchema, canEditContent } = params
            const isUserAlreadyHasAccount = await prisma.user.findFirst({
                where: { email },
            })

            const result = await prisma.boardUserSharing.create({
                data: {
                    board: { connect: { id: boardId } },
                    user: {
                        connectOrCreate: {
                            where: { email },
                            create: {
                                name: email.split('@')[0],
                                email,
                                image: 'to_link',
                            },
                        },
                    },
                    canEditSchema,
                    canEditContent,
                },
            })

            res.json({
                data: result,
                isUserAlreadyHasAccount: !!isUserAlreadyHasAccount,
            })
        })
        .catch((errors) => onCallExceptions(res, errors))
}
