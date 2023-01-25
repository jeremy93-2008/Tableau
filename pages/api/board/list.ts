import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req })
    const email = session?.user?.email ?? ''

    const userEntry = await prisma.user.findFirst({
        where: { email: { equals: email } },
    })

    if (!userEntry)
        return res.status(500).send("The user doesn't exist in the database")

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
}
