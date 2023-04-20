import { ErrorMessage } from 'shared-utils'
import { NextApiRequest } from 'next'

export function hasGetMethod<ISchemaParams>(req: NextApiRequest) {
    return (
        params: ISchemaParams,
        setError: (status: number, message: string) => false
    ) => {
        if (req.method !== 'GET') setError(405, ErrorMessage.NotAllowed)
        return true
    }
}
