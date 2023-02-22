import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/api/Authenticate'
import prisma from '../../../lib/prisma'
import { isAuthenticated } from '../../../server/services/auth/isAuthenticated'
import { authOptions } from '../auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'

type ISchemaParams = z.infer<typeof schema>

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
            await Authenticate.Post<typeof schema, ISchemaParams>(
                req,
                res,
                schema
            )
        ).checkAsync(async (params, setError) => {
            const session = await isAuthenticated({ req, res, authOptions })
            if (!session) return setError(401, ErrorMessage.Unauthorized)
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
