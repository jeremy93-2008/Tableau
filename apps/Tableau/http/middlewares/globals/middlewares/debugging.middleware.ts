import { NextApiRequest, NextApiResponse } from 'next'
import { getContext } from '../../../services/context'

export function DebuggingMiddleware() {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (process.env.NODE_ENV === 'production') return true
        console.info(
            'DebuggingMiddleware -',
            'url:',
            req.url,
            'body:',
            JSON.stringify(req.body, undefined, 4),
            'query:',
            JSON.stringify(req.query, undefined, 4)
        )
        console.log(
            'DebuggingMiddleware -',
            'session:',
            getContext('session'),
            'data:',
            getContext('data')
        )
        return true
    }
}
