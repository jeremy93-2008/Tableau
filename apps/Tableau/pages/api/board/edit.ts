import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { getBoardPermission } from 'shared-libs'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    backgroundUrl: z.string(),
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
                roleFn: getBoardPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { id, name, description, backgroundUrl } = params
            const result = await prisma.board.update({
                where: { id },
                data: {
                    name,
                    description,
                    backgroundUrl,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
