import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Task } from '.prisma/client'
import { z } from 'zod'
import { HttpPolicy } from '../../http/enums/http.enum'
import { withMiddleware } from '../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../http/middlewares/security.middleware'
import { IContext } from '../../http/services/context'

type IFinderSearchResult = Record<IFinderSearchType, Task[]>

type IFinderSearchType = 'task'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    searchText: z.string(),
    types: z.array(z.string()),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const values = context.data as ISchema
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
                                                email: context.session!.user!
                                                    .email,
                                            },
                                        },
                                    },
                                },
                                {
                                    user: {
                                        email: context.session!.user!.email,
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

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [],
        schema,
    }),
])
