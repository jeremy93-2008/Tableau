import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    addShareablePermissionCb,
    deleteShareablePermissionCb,
    editShareablePermissionCb,
    withAuth,
} from 'shared-libs'
import { mockSession } from 'next-auth/client/__tests__/helpers/mocks'
import user = mockSession.user

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

        const userBoardSharingDatabase = await prisma.boardUserSharing.findMany(
            {
                include: { user: true, board: { include: { user: true } } },
            }
        )

        const currentUser = await prisma.user.findFirst({
            where: { email: session.user!.email },
        })

        if (!currentUser) return res.status(400).send('Bad Request')

        for (let idx = 0; idx < userBoardSharing.length; idx++) {
            const { id } = userBoardSharing[idx]
            const userBoardSharingDatabaseToEdit =
                userBoardSharingDatabase.find(
                    (userBoardSharingSingle) => userBoardSharingSingle.id === id
                )

            if (!userBoardSharingDatabaseToEdit) return

            const userBoardSharingDatabaseOfCurrentUser =
                userBoardSharingDatabase.find(
                    (userBoardSharingSingle) =>
                        userBoardSharingSingle.boardId ===
                            userBoardSharingDatabaseToEdit.boardId &&
                        userBoardSharingSingle.userId === currentUser.id
                )

            const edit = await editShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
                params: {
                    id,
                    currentUser: currentUser!,
                    boardUserSharingToEdit: userBoardSharingDatabaseToEdit,
                    boardUserSharingOfCurrentUser:
                        userBoardSharingDatabaseOfCurrentUser,
                },
            })
            const remove = await deleteShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
                params: {
                    id,
                    currentUser: currentUser!,
                    boardUserSharingToEdit: userBoardSharingDatabaseToEdit,
                    boardUserSharingOfCurrentUser:
                        userBoardSharingDatabaseOfCurrentUser,
                },
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
