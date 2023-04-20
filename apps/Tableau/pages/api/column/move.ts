import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getBoardIdFromStatusId } from '../../../server/prisma/getBoardIdFromStatusId'
import { getColumnPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

export const columnMoveValidation = z.object({
    id: z.string(),
    order: z.number(),
})

const schema = z.object({
    currentColumn: columnMoveValidation,
    affectedColumn: columnMoveValidation,
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
                boardId: await getBoardIdFromStatusId(
                    req.body.currentColumn.id
                ),
                roleFn: getColumnPermission,
                action: 'move',
            }
        )
    )
        .success(async (params) => {
            const { currentColumn, affectedColumn } = params
            const result = prisma.$transaction([
                prisma.statusBoard.update({
                    where: { id: affectedColumn.id },
                    data: {
                        order: currentColumn.order,
                    },
                }),
                prisma.statusBoard.update({
                    where: { id: currentColumn.id },
                    data: {
                        order: affectedColumn.order,
                    },
                }),
            ])

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
