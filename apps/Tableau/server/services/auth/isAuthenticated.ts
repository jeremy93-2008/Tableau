import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'

interface IWithSessionOptions {
    req: NextApiRequest
    res: NextApiResponse
    authOptions: AuthOptions
}

export async function isAuthenticated(options: IWithSessionOptions) {
    const { res, req, authOptions } = options
    return (await getServerSession(req, res, authOptions)) ?? false
}
