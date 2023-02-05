import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { withSession } from 'shared-libs'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withSession({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id
        const name = req.body.name
        const description = req.body.description
        const backgroundUrl = req.body.backgroundUrl

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = await prisma.board.update({
            where: { id },
            data: {
                name,
                description,
                backgroundUrl,
            },
        })

        res.json(result)
    })
}
