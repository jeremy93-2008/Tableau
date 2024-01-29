import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { HttpPolicy } from '../../../http/enums/http.enum'
import { ValidationPolicy } from '../../../http/enums/validationPolicy'
import { withMiddleware } from '../../../http/decorators/withMiddleware'
import { SecurityMiddleware } from '../../../http/middlewares/security.middleware'
import { IContext } from '../../../http/services/context'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    email: z.string().email(),
})

async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
    context: IContext
) {
    const { email } = context.data as ISchema

    const result = await prisma.notification.findMany({
        where: {
            Users: {
                some: { email },
            },
        },
    })

    res.json(result)
}

export default withMiddleware(handler, [
    SecurityMiddleware({
        verbs: [HttpPolicy.Get],
        policies: [],
        requestDataType: ValidationPolicy.Query,
        schema,
    }),
])
