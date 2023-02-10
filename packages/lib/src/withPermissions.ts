import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { withAuth } from './withAuth'
import { useCallback } from 'react'
import { IFullBoardSharing } from 'shared-components/src/types/types'

/**
 * Set a wrapper function that depending on the return of the callback, execute the onSuccess function or not
 * @param options - A object with utility variables of NextJS
 * @param callback - A function that return a boolean
 * @param onSuccess - Function to execute if the value returned by the callback is true
 */
export async function withPermissions(
    options: { res: NextApiResponse },
    callback: () => Promise<boolean>,
    onSuccess: () => void
) {
    const { res } = options
    if (!(await callback()))
        return res
            .status(403)
            .send(
                'HTTP 403 Forbidden: Your current permissions do not allow you to perform the requested action. If you believe this is an error, please contact the system administrator for assistance.'
            )
    return onSuccess()
}
