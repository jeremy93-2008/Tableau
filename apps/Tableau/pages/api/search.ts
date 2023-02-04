import { NextApiRequest, NextApiResponse } from 'next'
import {
    IFinderSearchResult,
    IFinderSearchValues,
} from '../../components/header/components/finder'
import prisma from '../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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
                        {
                            user: {
                                name: {
                                    contains: values.searchText,
                                    mode: 'insensitive',
                                },
                            },
                        },
                        {
                            user: {
                                email: {
                                    contains: values.searchText,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    ],
                },
            })
        )
    )

    res.json({ task: result[0] } as IFinderSearchResult)
}
