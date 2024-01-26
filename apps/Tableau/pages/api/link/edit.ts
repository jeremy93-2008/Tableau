import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { IContext } from '../../../http/services/context'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    id: z.string(),
    name: z.string(),
    url: z.string(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { id, name, url: rawUrl } = context.data as ISchema

    const url =
        rawUrl.trim()[rawUrl.length - 1] === '/'
            ? rawUrl.slice(0, rawUrl.length - 1)
            : rawUrl

    const result = await prisma.link.update({
        where: { id },
        data: {
            name,
            url,
            image: url + '/favicon.ico',
        },
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
