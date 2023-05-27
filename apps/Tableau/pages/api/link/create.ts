import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import prisma from '../../../lib/prisma'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getTaskPermission } from 'shared-libs'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    name: z.string(),
    url: z.string(),
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
            const { name, url: rawUrl, taskId } = params

            const url =
                rawUrl.trim()[rawUrl.length - 1] === '/'
                    ? rawUrl.slice(0, rawUrl.length - 1)
                    : rawUrl

            const result = await prisma.link.create({
                data: {
                    name,
                    url,
                    image: url + '/favicon.ico',
                    task: {
                        connect: {
                            id: taskId,
                        },
                    },
                },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
