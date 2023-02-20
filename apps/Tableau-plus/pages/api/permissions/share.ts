import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    addShareablePermissionCb,
    deleteShareablePermissionCb,
    editShareablePermissionCb,
} from 'shared-libs'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    userBoardSharing: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { boardId, userBoardSharing: userBoardSharingString } = params

            const userBoardSharing = userBoardSharingString
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
                        params: { boardId: boardId },
                    }),
                    userBoardSharing: Array.from(ShareableRolesPermissions),
                },
            })
        })
        .catch((errors) => onCallExceptions(res, errors))
}
