import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { ErrorMessage } from 'shared-utils'
import { AuthProvider } from '../../../app/providers/auth/auth.provider'
import { GateProvider } from '../../../app/providers/gate/gate.provider'
import { GatePolicy } from '../../../app/providers/gate/gate.type'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await AuthProvider.guard({ req, res }, async (session) => {
        await GateProvider.guard(
            {
                session,
                policies: [GatePolicy.ReadBoardList],
                params: {
                    boardId: undefined,
                },
            },
            async () => {
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
            },
            () => res.status(403).send(ErrorMessage.Forbidden)
        )
    })
}
