import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { ErrorMessage } from 'shared-utils'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { IUser } from '../enums/user/user.type'
import { getContext, setContextValue } from '../services/context'

export function AuthMiddleware() {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const session = await getAuthenticatedUser({ req, res })
        if (!session) {
            if (getContext('isDebugging'))
                console.log(
                    'DebugMiddleware - AuthMiddleware - session:',
                    undefined
                )
            res.status(401).send(ErrorMessage.Unauthenticated)
            return false
        }
        setContextValue('session', session)
        return true
    }
}

async function getAuthenticatedUser({ req, res }: IUser.Attempt) {
    return await getServerSession(req, res, authOptions)
}
