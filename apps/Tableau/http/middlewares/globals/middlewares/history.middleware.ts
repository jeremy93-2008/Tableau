import { NextApiRequest, NextApiResponse } from 'next'
import { getContext } from '../../../services/context'

export function HistoryMiddleware() {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // TODO: Implement history middleware
    }
}
