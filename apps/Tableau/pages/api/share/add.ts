import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { addShareablePermissionCb } from 'shared-libs'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/api/Authenticate'

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
    ;(
        await (
            await Authenticate.Post<typeof schema, ISchemaParams>(
                req,
                res,
                schema
            )
        ).checkAsync(async () => {
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
