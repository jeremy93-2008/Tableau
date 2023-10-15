import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getTaskPermission } from 'shared-libs'
import { TaskHistoryMessageCode } from 'shared-utils'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    id: z.string().cuid(),
    messageCode: z.nativeEnum(TaskHistoryMessageCode),
    messageParams: z.record(z.string().trim().min(1), z.string().trim().min(1)),
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
                boardId: req.body.boardId,
                roleFn: getTaskPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { id, messageCode, messageParams } = params

            const result = await prisma.history.update({
                where: { id },
                data: {
                    messageCode,
                    messageParams,
                    createdAt: new Date(),
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}