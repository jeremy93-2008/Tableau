import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Task } from '.prisma/client'
import { z } from 'zod'
import { SecurityProvider } from '../../app/providers/security/security.provider'
import { HttpPolicy } from '../../app/providers/http/http.type'

type IFinderSearchResult = Record<IFinderSearchType, Task[]>

type IFinderSearchType = 'task'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    searchText: z.string(),
    types: z.array(z.string()),
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
                permissions: [],
            },
            validations: { schema },
        },
        async (session, values) => {
            const result = await prisma.$transaction(
                values.types.map((type) =>
                    prisma[type as IFinderSearchType].findMany({
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: values.searchText,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    description: {
                                        contains: values.searchText,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                            AND: {
                                board: {
                                    OR: [
                                        {
                                            BoardUserSharing: {
                                                some: {
                                                    user: {
                                                        email: session.user!
                                                            .email,
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            user: {
                                                email: session.user!.email,
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        include: {
                            user: true,
                            assignedUsers: { include: { User: true } },
                            tags: true,
                        },
                    })
                )
            )

            res.json({ task: result[0] } as IFinderSearchResult)
        }
    )
}
