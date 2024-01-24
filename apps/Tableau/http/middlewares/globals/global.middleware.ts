import { MiddlewareFunction } from '../../decorators/withMiddleware'
import { DebuggingMiddleware } from './debugging.middleware'

export const beforeGlobalMiddlewares: MiddlewareFunction[] = []

export const afterGlobalMiddlewares: MiddlewareFunction[] = [
    DebuggingMiddleware(),
]
