import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid().nullable(),
    email: z.string().email().nullable(),
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
                permissions: [PermissionPolicy.ReadBoardList],
            },
            validations: { schema, valueType: ValidationValueType.Query },
        },
        async (_session, params) => {
            const result = await prisma.user.findMany({
                where: {
                    OR: [
                        { id: params.id ?? '' },
                        { email: params.email ?? '' },
                    ],
                },
                include: { accounts: true, sessions: true },
            })

            res.json(result[0])
        }
    )
}
