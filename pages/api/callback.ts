// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { mockSession } from 'next-auth/client/__tests__/helpers/mocks'
import user = mockSession.user

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const name = req.body.name as string
    const email = req.body.email as string
    const image = req.body.image as string

    const userAlreadyExist = await prisma.user.findFirst({
        where: {
            email: { equals: email },
        },
    })

    if (req.method === 'POST') {
        if (userAlreadyExist) return res.status(204).send('OK')
        const user = await prisma.user.create({
            data: {
                name,
                email,
                image,
                password: 'PASSWORD',
            },
        })
        res.status(200).send(user)
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}
