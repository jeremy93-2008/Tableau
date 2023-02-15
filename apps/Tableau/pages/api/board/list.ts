import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const session = await getServerSession(req, res, authOptions)
        const email = session?.user?.email ?? ''
        const userEntry = await prisma.user.findFirst({
            where: { email: { equals: email } },
        })

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
                        Task: true,
                    },
                },
            },
            orderBy: { board: { name: 'desc' } },
        })

        res.json(result.map((r) => r.board))
    })
}
