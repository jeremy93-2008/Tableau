import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const result = await prisma.user.findMany({
            include: { accounts: true, sessions: true },
        })

        res.json(result)
    })
}
