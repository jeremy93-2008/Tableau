import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    backgroundUrl: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { name, description, backgroundUrl } = context.data as ISchema

    const email = context.session?.user?.email ?? ''

    const userEntry = await prisma.user.findFirst({
        where: { email: { equals: email } },
    })

    if (!email) return res.status(401).send(ErrorMessage.Unauthenticated)

    if (!userEntry)
        return res.status(500).send("The user doesn't exist in the database")

    const result = await prisma.board.create({
        data: {
            name,
            description,
            backgroundUrl,
            user: {
                connect: { id: userEntry.id },
            },
            Status: {
                create: [
                    {
                        order: 0,
                        status: {
                            connectOrCreate: {
                                where: { name: 'To Do' },
                                create: {
                                    name: 'To Do',
                                    isDefault: true,
                                },
                            },
                        },
                    },
                    {
                        order: 1,
                        status: {
                            connectOrCreate: {
                                where: { name: 'In Progress' },
                                create: {
                                    name: 'In Progress',
                                    isDefault: true,
                                },
                            },
                        },
                    },
                    {
                        order: 2,
                        status: {
                            connectOrCreate: {
                                where: { name: 'Done' },
                                create: {
                                    name: 'Done',
                                    isDefault: true,
                                },
                            },
                        },
                    },
                ],
            },
            BoardUserSharing: {
                create: {
                    user: { connect: { email } },
                    canEditSchema: true,
                    canEditContent: true,
                },
            },
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [],
        schema,
    }),
])
