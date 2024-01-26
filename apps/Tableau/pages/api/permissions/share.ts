import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import {
    addShareablePermissionCb,
    deleteShareablePermissionCb,
    editShareablePermissionCb,
} from 'shared-libs'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'
import { ValidationValueType } from '../../../http/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    userBoardSharing: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { boardId, userBoardSharing: userBoardSharingString } =
        context.data as ISchema

    const userBoardSharing = userBoardSharingString
        .split(',')
        .map((val) => ({ id: val }))

    const ShareableRolesPermissions = new Map()

    for (let idx = 0; idx < userBoardSharing.length; idx++) {
        const { id } = userBoardSharing[idx]
        const edit = await editShareablePermissionCb({
            req: _req,
            res,
            authOptions,
            prisma,
            params: { id },
        })
        const remove = await deleteShareablePermissionCb({
            req: _req,
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
                req: _req,
                res,
                authOptions,
                prisma,
                params: { boardId: boardId },
            }),
            userBoardSharing: Array.from(ShareableRolesPermissions),
        },
    })
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [],
        requestDataType: ValidationValueType.Query,
        schema,
    }),
])
