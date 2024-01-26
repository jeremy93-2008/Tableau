import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'
import { HistoryRepository } from '../../../http/repositories/history/history.repository'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    taskId: z.string().cuid(),
    messageCode: z.nativeEnum(TaskHistoryMessageCode),
    messageParams: z.record(z.string().trim().min(1), z.string().trim().min(1)),
    email: z.string().email(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { messageCode, messageParams, taskId, email } =
        context.data as ISchema

    const history = new HistoryRepository()
    const result = history.add({
        taskId,
        code: messageCode,
        params: messageParams,
        email,
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [PermissionPolicy.UpdateTask],
        schema,
    }),
])
