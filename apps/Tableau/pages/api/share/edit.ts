import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    editShareablePermissionCb,
    withAuth,
    withPermissions,
} from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res, session) => {
        return withPermissions(
            { res },
            () =>
                editShareablePermissionCb({
                    req,
                    res,
                    authOptions,
                    prisma,
                }),
            async () => {
                const id = req.body.id as string
                const canEditSchema = req.body.canEditSchema as boolean
                const canEditContent = req.body.canEditContent as boolean

                if (req.method !== 'POST')
                    return res
                        .status(405)
                        .send(
                            'Error: Method Not Allowed. Please use the POST method for this request.'
                        )

                if (!id)
                    return res
                        .status(400)
                        .send('No BoardId and Email was provided')

                const result = await prisma.boardUserSharing.update({
                    where: { id },
                    data: {
                        canEditSchema: canEditSchema || false,
                        canEditContent: canEditContent || false,
                    },
                })

                res.json(result)
            }
        )
    })
}
