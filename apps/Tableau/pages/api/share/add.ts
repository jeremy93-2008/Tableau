import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'
import { BOARD_LIMIT, COLUMN_LIMIT } from 'shared-utils'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const boardId = req.body.boardId
        const email = req.body.email
        const canEditSchema = req.body.canEditSchema
        const canEditContent = req.body.canEditContent

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = prisma.boardUserSharing.create({
            data: {
                board: { connect: { id: boardId } },
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: {
                            name: email,
                            email,
                        },
                    },
                },
                canEditSchema,
                canEditContent,
            },
        })

        res.json(result)
    })
}
