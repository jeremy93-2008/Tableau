import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    addShareablePermissionCb,
    deleteShareablePermissionCb,
    editShareablePermissionCb,
    withAuth,
} from 'shared-libs'

interface IRequestObject {
    boardId: string
    userBoardSharing: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res, session) => {
        const requestObj = req.query as unknown as IRequestObject

        if (!requestObj.boardId || !requestObj.userBoardSharing)
            return res.status(400).send('Bad Request')

        const userBoardSharing = requestObj.userBoardSharing
            .split(',')
            .map((val) => ({ id: val }))

        const ShareableRolesPermissions = new Map()

        for (let idx = 0; idx < userBoardSharing.length; idx++) {
            const { id } = userBoardSharing[idx]
            const edit = await editShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
                params: { id },
            })
            const remove = await deleteShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
                params: { id },
            })

            ShareableRolesPermissions.set(id, {
                edit,
                delete: remove,
            })
        }

        return res.status(200).send({
            permissions: {
                add: await addShareablePermissionCb({
                    req,
                    res,
                    authOptions,
                    prisma,
                    params: { boardId: requestObj.boardId },
                }),
                userBoardSharing: Array.from(ShareableRolesPermissions),
            },
        })
    })
}
