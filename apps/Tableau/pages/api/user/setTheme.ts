import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { authOptions } from '../auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    email: z.string(),
    isDarkMode: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await (
            await Authenticate.Post<typeof schema, ISchema>(req, res, schema)
        ).checkAsync(async (params, setError) => {
            const session = await isAuthenticated({ req, res, authOptions })
            if (!session) return setError(401, ErrorMessage.Unauthenticated)
            if (!params) return setError(400, ErrorMessage.BadRequest)
            return session.user.email === params!.email
        })
    )
        .success(async (params) => {
            const result = await prisma.user.update({
                where: { email: params.email },
                data: {
                    isDarkMode: params.isDarkMode,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
