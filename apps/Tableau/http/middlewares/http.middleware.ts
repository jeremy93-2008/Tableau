import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorMessage } from 'shared-utils'
import { HttpPolicy } from '../providers/http/http.type'

export function HttpMiddleware(verbs: HttpPolicy[]) {
    return (req: NextApiRequest, res: NextApiResponse) => {
        if (!req) return false
        const method = req.method?.toLowerCase() as HttpPolicy

        if (!verbs.includes(method)) {
            res.status(405).send(ErrorMessage.NotAllowed)
            return false
        }

        return true
    }
}
