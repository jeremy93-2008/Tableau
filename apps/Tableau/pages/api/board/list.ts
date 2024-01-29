import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { PermissionPolicy } from '../../../http/enums/permission.enum'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

const schema = z.string()

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const email = context.session?.user?.email ?? ''
    const userEntry = await prisma.user.findFirst({
        where: { email: { equals: email } },
    })

    if (!email) return res.status(401).send(ErrorMessage.Unauthenticated)

    if (!userEntry)
        return res.status(500).send("The user doesn't exist in the database")

    const result = await prisma.boardUserSharing.findMany({
        where: { user: { email } },
        include: {
            board: {
                include: {
                    Status: {
                        include: { status: true },
                    },
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
                                orderBy: {
                                    id: 'asc',
                                },
                            },
                            tags: {
                                orderBy: {
                                    id: 'asc',
                                },
                            },
                            Comment: {
                                orderBy: {
                                    createdAt: 'asc',
                                },
                                include: {
                                    user: true,
                                },
                            },
                            History: {
                                orderBy: {
                                    createdAt: 'asc',
                                },
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
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [PermissionPolicy.ReadBoardList],
        schema,
    }),
])
