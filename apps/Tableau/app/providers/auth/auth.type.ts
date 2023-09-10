import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

export namespace IAuth {
    export interface Attempt {
        req: NextApiRequest
        res: NextApiResponse
    }
    export interface Guard {
        api: IAuth.Attempt
        callback: (session: Session) => void
    }
}
