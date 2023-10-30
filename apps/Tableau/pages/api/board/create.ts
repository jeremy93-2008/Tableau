import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    backgroundUrl: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.CreateBoard],
            },
            validations: { schema },
        },
        async (session, params) => {
            const { name, description, backgroundUrl } = params

            const email = session?.user?.email ?? ''

            const userEntry = await prisma.user.findFirst({
                where: { email: { equals: email } },
            })

            if (!email)
                return res.status(401).send(ErrorMessage.Unauthenticated)

            if (!userEntry)
                return res
                    .status(500)
                    .send("The user doesn't exist in the database")

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
    )
}
