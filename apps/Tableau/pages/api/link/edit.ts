import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    id: z.string(),
    name: z.string(),
    url: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.UpdateTask],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, name, url: rawUrl } = params

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
    )
}
