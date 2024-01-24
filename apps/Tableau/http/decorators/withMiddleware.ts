import { NextApiRequest, NextApiResponse } from 'next'
import { createBasicContext, getContext, IContext } from '../services/context'

type APIRoute<ResponseData> = (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
    context: IContext
) => ResponseData | Promise<ResponseData>

type MiddlewareFunction = (
    req: NextApiRequest,
    res: NextApiResponse
) => boolean | Promise<boolean>

export function withMiddleware<ResponseData>(
    handler: APIRoute<ResponseData>,
    middlewares: MiddlewareFunction[]
) {
    return async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
        createBasicContext(req, res)

        for (const middleware of middlewares) {
            const result = await middleware(req, res)
            if (!result) return
        }

        await handler(req, res, getContext())
    }
}
