import { ErrorMessage } from 'shared-utils'
import { deleteExpiredSession } from './session/deleteExpiredSession'
import { Session } from 'next-auth'

interface ICheckValidRequest {
    session: Session | false
    setError: (code: number, message: string) => void
    params: any
}

export async function checkValidRequest({
    session,
    setError,
    params,
}: ICheckValidRequest) {
    if (!session) {
        return setError(401, ErrorMessage.Unauthenticated)
    }
    if (new Date(session.expires).getTime() + 10000 > Date.now()) {
        await deleteExpiredSession(session)
    }
    if (!params) return setError(400, ErrorMessage.BadRequest)
    return true
}
