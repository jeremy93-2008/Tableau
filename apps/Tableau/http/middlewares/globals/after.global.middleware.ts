import { MiddlewareFunction } from '../../decorators/withMiddleware'
import { DebuggingMiddleware } from './middlewares/debugging.middleware'

export const afterGlobalMiddlewares: MiddlewareFunction[] = [
    DebuggingMiddleware(),
]
