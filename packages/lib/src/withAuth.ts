import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'

interface IWithSessionOptions {
    req: NextApiRequest
    res: NextApiResponse
    authOptions: AuthOptions
}

export async function withAuth(
    options: IWithSessionOptions,
    onSuccess: (
        req: NextApiRequest,
        res: NextApiResponse,
        session: Session
    ) => void,
    onFail?: (req: NextApiRequest, res: NextApiResponse) => void
) {
    const { res, req, authOptions } = options
    const session = await getServerSession(req, res, authOptions)

    if (!session)
        return onFail
            ? onFail(req, res)
            : res
                  .status(401)
                  .send(
                      'Your session is invalid or has expired. Please log in again to continue.'
                  )

    return onSuccess(req, res, session)
}
