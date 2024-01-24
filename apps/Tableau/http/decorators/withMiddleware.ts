import { NextApiRequest, NextApiResponse } from 'next'
import { createBasicContext, getContext, IContext } from '../services/context'
import {
    afterGlobalMiddlewares,
    beforeGlobalMiddlewares,
} from '../middlewares/globals/global.middleware'

export type APIRoute<ResponseData> = (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
    context: IContext
) => ResponseData | Promise<ResponseData>

export type MiddlewareFunction = (
    req: NextApiRequest,
    res: NextApiResponse
) => boolean | Promise<boolean>

export function withMiddleware<ResponseData>(
    handler: APIRoute<ResponseData>,
    middlewares: MiddlewareFunction[],
    options?: {
        skipGlobalMiddlewares?: boolean
    }
) {
    const { skipGlobalMiddlewares } = options || {}

    let allMiddlewares = [
        ...(!skipGlobalMiddlewares ? beforeGlobalMiddlewares : []),
        ...middlewares,
        ...(!skipGlobalMiddlewares ? afterGlobalMiddlewares : []),
    ]

    return async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
        createBasicContext(req, res)

        for (const middleware of allMiddlewares) {
            const result = await middleware(req, res)
            if (!result) {
                res.status(500).send('Internal Server Error' as ResponseData)
                return
            }
        }

        await handler(req, res, getContext())
    }
}
