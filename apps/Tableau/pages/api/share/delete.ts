import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { withAuth } from 'shared-libs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withAuth({ req, res, authOptions }, async () => {
        const id = req.body.id as string

        if (req.method !== 'POST')
            return res
                .status(405)
                .send(
                    'Error: Method Not Allowed. Please use the POST method for this request.'
                )

        if (!id)
            return res.status(400).send('No BoardId and Email was provided')

        const result = await prisma.boardUserSharing.delete({
            where: { id },
        })

        res.json(result)
    })
}
