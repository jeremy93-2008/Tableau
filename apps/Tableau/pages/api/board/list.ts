import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { UserProvider } from '../../../app/providers/user/user.provider'
import { PermissionProvider } from '../../../app/providers/permission/permission.provider'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'
import { HttpProvider } from '../../../app/providers/http/http.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { ValidationProvider } from '../../../app/providers/validation/validation.provider'
import { ValidationRequest } from '../../../app/providers/validation/validation.request'

const schema = z.string()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await HttpProvider.guard({ req, res }, [HttpPolicy.Get], async () => {
        await UserProvider.guard({ req, res }, async (session) => {
            await ValidationProvider.guard(
                { req, res, schema, requestValue: ValidationRequest.Body },
                async () => {
                    await PermissionProvider.guard(
                        {
                            session,
                            policies: [PermissionPolicy.ReadBoardList],
                        },
                        async () => {
                            const email = session?.user?.email ?? ''
                            const userEntry = await prisma.user.findFirst({
                                where: { email: { equals: email } },
                            })

                            if (!email)
                                return res
                                    .status(401)
                                    .send(ErrorMessage.Unauthenticated)

                            if (!userEntry)
                                return res
                                    .status(500)
                                    .send(
                                        "The user doesn't exist in the database"
                                    )

                            const result =
                                await prisma.boardUserSharing.findMany({
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
                                                                createdAt:
                                                                    'asc',
                                                            },
                                                            include: {
                                                                user: true,
                                                            },
                                                        },
                                                        History: {
                                                            orderBy: {
                                                                createdAt:
                                                                    'asc',
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
                        },
                        () => {
                            res.status(401).send(ErrorMessage.Forbidden)
                        }
                    )
                }
            )
        })
    })
}
