import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    email: z.string().email(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Get,
                permissions: [],
            },
            validations: { schema, valueType: ValidationValueType.Query },
        },
        async (_session, params) => {
            const { email } = params

            const result = await prisma.notification.findMany({
                where: {
                    Users: {
                        some: { email },
                    },
                },
            })

            res.json(result)
        }
    )
}
