import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Task } from '.prisma/client'
import { authOptions } from './auth/[...nextauth]'
import { onCallExceptions } from '../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { isAuthenticated } from '../../server/next/auth/isAuthenticated'
import { Session } from 'next-auth'
import { Authenticate } from '../../server/next/auth/Authenticate'

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
    await (
        await Authenticate.Post<typeof schema, ISchema>(req, res, schema)
    )
        .success(async (values) => {
            const session = (await isAuthenticated({
                req,
                res,
                authOptions,
            })) as Session
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
        })
        .catch((errors) => onCallExceptions(res, errors))
}
