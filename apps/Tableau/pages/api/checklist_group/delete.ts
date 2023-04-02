import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/api/Authenticate'
import { getTaskPermission } from 'shared-libs'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
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

            const result = await prisma.checklistGroup.delete({
                where: { id },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
