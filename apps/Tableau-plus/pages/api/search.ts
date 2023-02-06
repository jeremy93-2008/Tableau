import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Task } from '.prisma/client'
import { authOptions } from './auth/[...nextauth]'
import { withAuth } from 'shared-libs'

type IFinderSearchResult = Record<IFinderSearchType, Task[]>

type IFinderSearchType = 'task'

interface IFinderSearchValues {
    searchText: string
    types: IFinderSearchType[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res, session) => {
        const values: IFinderSearchValues = req.body

        const result = await prisma.$transaction(
            values.types.map((type) =>
                prisma[type].findMany({
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
                            user: { email: { equals: session.user!.email } },
                        },
                    },
                })
            )
        )

        res.json({ task: result[0] } as IFinderSearchResult)
    })
}
