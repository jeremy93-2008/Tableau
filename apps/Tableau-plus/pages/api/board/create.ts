import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    name: z.string(),
    description: z.string(),
    backgroundUrl: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Post<typeof schema, ISchemaParams>(req, res, schema)
    )
        .success(async (params) => {
            const { name, description, backgroundUrl } = params
            const session = await getSession({ req })
            const email = session?.user?.email ?? ''

            const userEntry = await prisma.user.findFirst({
                where: { email: { equals: email } },
            })

            if (!userEntry)
                return res
                    .status(500)
                    .send("The user doesn't exist in the database")

            const result = await prisma.board.create({
                data: {
                    name,
                    description,
                    backgroundUrl,
                    user: {
                        connect: { id: userEntry.id },
                    },
                    Status: {
                        create: [
                            {
                                order: 0,
                                status: {
                                    connectOrCreate: {
                                        where: { name: 'To Do' },
                                        create: {
                                            name: 'To Do',
                                            isDefault: true,
                                        },
                                    },
                                },
                            },
                            {
                                order: 1,
                                status: {
                                    connectOrCreate: {
                                        where: { name: 'In Progress' },
                                        create: {
                                            name: 'In Progress',
                                            isDefault: true,
                                        },
                                    },
                                },
                            },
                            {
                                order: 2,
                                status: {
                                    connectOrCreate: {
                                        where: { name: 'Done' },
                                        create: {
                                            name: 'Done',
                                            isDefault: true,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    BoardUserSharing: {
                        create: {
                            user: { connect: { email } },
                            canEditSchema: true,
                            canEditContent: true,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
