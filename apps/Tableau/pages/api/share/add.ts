import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { Notification } from '../../../http/repositories/notification/notification.repository'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    email: z.string().email(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { boardId, email, canEditSchema, canEditContent } =
        context.data as ISchema

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

    const board = await prisma.board.findFirst({
        where: { id: boardId },
    })

    await Notification.add(
        'info',
        'You have been invited to collaborate on a board (' +
            board?.name +
            ') by ' +
            context.session?.user.name,
        [email]
    )

    res.json({
        data: result,
        isUserAlreadyHasAccount: !!isUserAlreadyHasAccount,
    })
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.CreateBoardUserSharing],
        schema,
    }),
])
