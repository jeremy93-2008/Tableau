import { IUser } from './user.type'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { ErrorMessage } from 'shared-utils'

export class UserProvider {
    static async isAuthenticated({ req, res }: IUser.Attempt) {
        return !!(await this.getSession({ req, res }))
    }

    static async getSession({ req, res }: IUser.Attempt) {
        return await getServerSession(req, res, authOptions)
    }

    static async attempt({ req, res }: IUser.Attempt) {
        return await this.isAuthenticated({ req, res })
    }

    static async guard(
        { req, res }: IUser.Guard['api'],
        callback: IUser.Guard['callback']
    ) {
        const session = await this.getSession({ req, res })

        if (session) return callback(session)

        return res.status(401).send(ErrorMessage.Unauthenticated)
    }
}
