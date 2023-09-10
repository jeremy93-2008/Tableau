import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { getTaskPermission } from 'shared-libs'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'
import { HistoryRepository } from '../../../app/repositories/history/history.repository'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    messageCode: z.nativeEnum(TaskHistoryMessageCode),
    messageParams: z.record(z.string().trim().min(1), z.string().trim().min(1)),
    email: z.string().email(),
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
            const { messageCode, messageParams, taskId, email } = params

            const history = new HistoryRepository()
            const result = history.add({
                taskId,
                code: messageCode,
                params: messageParams,
                email,
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
