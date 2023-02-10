import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    addShareablePermissionCb,
    withAuth,
    withPermissions,
} from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        return withPermissions(
            { res },
            () => addShareablePermissionCb({ req, res, authOptions, prisma }),
            async () => {
                const boardId = req.body.boardId
                const email = req.body.email
                const canEditSchema = req.body.canEditSchema
                const canEditContent = req.body.canEditContent

                if (!email || !boardId || !email.includes('@'))
                    return res
                        .status(400)
                        .send(
                            'Error: Invalid Parameters. Please check and correct the following parameters before proceeding.'
                        )

                if (req.method !== 'POST')
                    return res
                        .status(405)
                        .send(
                            'Error: Method Not Allowed. Please use the POST method for this request.'
                        )

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
            }
        )
    })
}
