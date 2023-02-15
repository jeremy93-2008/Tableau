import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/database/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const email = req.query.email as string

        if (!email) return res.status(400).send('No Email was provided')

        const result = await prisma.user.findUnique({
            where: {
                email,
            },
            include: { accounts: true, sessions: true },
        })

        res.json(result)
    })
}
