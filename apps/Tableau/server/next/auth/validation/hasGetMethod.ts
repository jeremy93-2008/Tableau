import { ErrorMessage } from 'shared-utils'
import { NextApiRequest } from 'next'

export function hasGetMethod<ISchema>(req: NextApiRequest) {
    return (
        params: ISchema,
        setError: (status: number, message: string) => false
    ) => {
        if (req.method !== 'GET') setError(405, ErrorMessage.NotAllowed)
        return true
    }
}
