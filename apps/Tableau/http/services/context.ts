import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

export interface IContext {
    session?: Session
    data?: any
    [key: string]: any
}

let _context: IContext | null = null

export function createBasicContext(req: NextApiRequest, res: NextApiResponse) {
    _context = {}
}

export function getContext<TContext extends IContext>(key?: string) {
    if (!_context) throw new Error('Context not created')
    if (key) return _context[key]
    return _context as TContext
}

export function setContextValue(key: string, value: any) {
    if (!_context) throw new Error('Context not created')
    _context[key] = value
}
