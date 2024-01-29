import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { ErrorMessage } from 'shared-utils'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    email: z.string(),
    isDarkMode: z.boolean(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const params = context.data as ISchema
    if (params.email !== context.session!.user?.email) {
        return res.status(403).send(ErrorMessage.Forbidden)
    }

    const result = await prisma.user.update({
        where: { email: params.email },
        data: {
            isDarkMode: params.isDarkMode,
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Post],
        policies: [],
        schema,
    }),
])
