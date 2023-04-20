import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getColumnPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusName: z.string(),
    isDefault: z.boolean(),
    order: z.number(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchemaParams>(
            req,
            res,
            schema,
            {
                boardId: req.body.id,
                roleFn: getColumnPermission,
                action: 'add',
            }
        )
    )
        .success(async (params) => {
            const { id, statusName, order, isDefault } = params

            const result = await prisma.statusBoard.create({
                data: {
                    order,
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault },
                        },
                    },
                    board: {
                        connect: { id },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
