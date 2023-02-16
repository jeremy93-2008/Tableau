import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/services/exceptions/onCallExceptions'
import { getBoardIdFromStatusId } from '../../../server/prisma/getBoardIdFromStatusId'
import { getColumnPermission } from 'shared-libs'
import { Authenticate } from '../../../server/api/Authenticate'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    id: z.string(),
    statusName: z.string(),
    oldStatusName: z.string(),
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
                boardId: await getBoardIdFromStatusId(req.body.id),
                roleFn: getColumnPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { id, statusName, oldStatusName } = params
            const result = await prisma.statusBoard.update({
                where: {
                    id,
                },
                data: {
                    status: {
                        connectOrCreate: {
                            where: { name: statusName },
                            create: { name: statusName, isDefault: false },
                        },
                    },
                },
            })

            //We check if status row based on statusName can be deleted
            if (
                (await prisma.statusBoard.count({
                    where: { status: { name: oldStatusName } },
                })) === 0
            )
                await prisma.status.delete({ where: { name: oldStatusName } })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
