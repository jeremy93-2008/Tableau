import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
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

        const result = await prisma.board.findMany({
            where: {
                user: { email: { equals: userEntry.email } },
            },
            include: {
                Status: { include: { status: true } },
                user: true,
                Task: true,
            },
        })

        res.json(result)
    })
}
