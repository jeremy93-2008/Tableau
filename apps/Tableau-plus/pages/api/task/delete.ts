import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = await prisma.task.delete({ where: { id } })

        res.json(result)
    })
}
