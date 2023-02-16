import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Task } from '.prisma/client'
import { authOptions } from './auth/[...nextauth]'
import { onCallExceptions } from '../../server/services/exceptions/onCallExceptions'
import { z } from 'zod'
import { isAuthenticated } from '../../server/services/auth/isAuthenticated'
import { Session } from 'next-auth'
import { Authenticate } from '../../server/api/Authenticate'

type IFinderSearchResult = Record<IFinderSearchType, Task[]>

type IFinderSearchType = 'task'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    searchText: z.string(),
    types: z.array(z.string()),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Get<typeof schema, ISchemaParams>(req, res, schema)
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
                    })
                )
            )

            res.json({ task: result[0] } as IFinderSearchResult)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
