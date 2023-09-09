import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { ErrorMessage } from 'shared-utils'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async () => {
            const session = await getServerSession(req, res, authOptions)
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

            const result = await prisma.boardUserSharing.findMany({
                where: { user: { email } },
                include: {
                    board: {
                        include: {
                            Status: { include: { status: true } },
                            user: true,
                            Task: {
                                include: {
                                    user: true,
                                    assignedUsers: {
                                        include: {
                                            User: true,
                                        },
                                    },
                                    checklistsGroup: {
                                        include: {
                                            checklists: {
                                                orderBy: {
                                                    id: 'asc',
                                                },
                                            },
                                        },
                                        orderBy: {
                                            id: 'asc',
                                        },
                                    },
                                    link: {
                                        orderBy: { id: 'asc' },
                                    },
                                    tags: {
                                        orderBy: { id: 'asc' },
                                    },
                                    Comment: {
                                        orderBy: { createdAt: 'asc' },
                                        include: {
                                            user: true,
                                        },
                                    },
                                    History: {
                                        orderBy: { createdAt: 'asc' },
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { board: { name: 'desc' } },
            })

            res.json(result.map((r) => r.board))
        })
        .catch((errors) => onCallExceptions(res, errors))
}
