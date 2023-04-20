import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { columnMoveValidation } from '../column/move'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getBoardIdFromStatusId } from '../../../server/prisma/getBoardIdFromStatusId'
import { getColumnPermission } from 'shared-libs'
import { Authenticate } from '../../../server/next/auth/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.array(columnMoveValidation)

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
                boardId: await getBoardIdFromStatusId(req.body[0].id),
                roleFn: getColumnPermission,
                action: 'move',
            }
        )
    )
        .success(async (params) => {
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
        })
        .catch((errors) => onCallExceptions(res, errors))
}
