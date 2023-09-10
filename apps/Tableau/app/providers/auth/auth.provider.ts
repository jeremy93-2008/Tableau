import { IAuth } from './auth.type'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'

export class AuthProvider {
    static async isAuthenticated({ req, res }: IAuth.Attempt) {
        return await getServerSession(req, res, authOptions)
    }

    static async attempt({ req, res }: IAuth.Attempt) {
        const session = await this.isAuthenticated({ req, res })
        return !!session
    }

    static async guard(
        { req, res }: IAuth.Guard['api'],
        callback: IAuth.Guard['callback']
    ) {
        const session = await this.isAuthenticated({ req, res })

        if (session) return callback(session)

        return res.status(401).send(ErrorMessage.Unauthenticated)
    }
}
