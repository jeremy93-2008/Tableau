import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'
import { authOptions } from '../auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    email: z.string(),
    isDarkMode: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [],
            },
            validations: { schema },
        },
        async (session, params) => {
            if (params.email !== session.user?.email) {
                return res.status(403).send(ErrorMessage.Forbidden)
            }

            const result = await prisma.user.update({
                where: { email: params.email },
                data: {
                    isDarkMode: params.isDarkMode,
                },
            })

            res.json(result)
        }
    ).catch((errors) => onCallExceptions(res, errors))
}
