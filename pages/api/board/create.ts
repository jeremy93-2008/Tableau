import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const name = req.body.name
    const description = req.body.description
    const backgroundUrl = req.body.backgroundUrl

    const session = await getSession({ req })
    const email = session?.user?.email ?? ''

    const userEntry = await prisma.user.findFirst({
        where: { email: { equals: email } },
    })

    if (req.method !== 'POST')
        return res.status(405).send('Method not allowed. Use Post instead')

    if (!userEntry)
        return res.status(500).send("The user doesn't exist in the database")

    const result = await prisma.board.create({
        data: {
            name,
            description,
            backgroundUrl,
            user: {
                connect: { id: userEntry.id },
            },
        },
    })

    res.json(result)
}
