import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'
import { SecurityProvider } from '../../../app/providers/security/security.provider'

const schema = z.string()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Get,
                permissions: [PermissionPolicy.ReadBoardList],
            },
            validations: { schema, valueType: ValidationValueType.Body },
        },
        async (session) => {
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
    )
}
