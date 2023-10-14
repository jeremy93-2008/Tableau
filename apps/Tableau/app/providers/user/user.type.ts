import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

export namespace IUser {
    export interface Attempt {
        req: NextApiRequest
        res: NextApiResponse
    }
    export interface Guard {
        api: IUser.Attempt
        callback: (session: Session) => void
    }
}
