import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { getTaskPermission } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    boardId: z.string(),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    checked: z.optional(z.boolean()),
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
            const { id, name, checked } = params

            const result = await prisma.checklist.update({
                where: { id },
                data: {
                    name: name ?? undefined,
                    checked: checked ?? undefined,
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
