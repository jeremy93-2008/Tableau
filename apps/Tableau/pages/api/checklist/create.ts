import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { getTaskPermission } from 'shared-libs'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    name: z.string(),
    email: z.string(),
    checklistGroupId: z.string(),
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
                permissions: [PermissionPolicy.UpdateTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { name, email, checklistGroupId } = params

            const result = await prisma.checklist.create({
                data: {
                    name,
                    checked: false,
                    assignedUser: { connect: { email } },
                    checklistGroup: { connect: { id: checklistGroupId } },
                },
            })

            res.json(result)
        }
    )
}
