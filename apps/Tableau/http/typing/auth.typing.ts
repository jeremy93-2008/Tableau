import { NextApiRequest, NextApiResponse } from 'next'

export type IGetAuthenticatedUserParams = {
    req: NextApiRequest
    res: NextApiResponse
}
