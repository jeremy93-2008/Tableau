import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { columnMoveValidation } from '../column/move'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.array(columnMoveValidation)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.UpdateStatus],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const orderedColumns = params
            const result = await prisma.$transaction(
                orderedColumns.map((column) => {
                    return prisma.statusBoard.update({
                        where: { id: column.id },
                        data: {
                            order: column.order,
                        },
                    })
                })
            )

            res.json(result)
        }
    )
}
