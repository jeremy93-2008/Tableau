import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { getTaskPermission } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { Authenticate } from '../../../server/api/Authenticate'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    boardId: z.string(),
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
            const { id } = params

            const result = await prisma.checklist.delete({
                where: { id },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
