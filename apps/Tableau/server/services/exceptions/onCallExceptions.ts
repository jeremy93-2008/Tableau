import { NextApiResponse } from 'next'
import { IErrorPromiseReject } from 'shared-libs/src/procedure'

export function onCallExceptions(
    res: NextApiResponse,
    errors: IErrorPromiseReject<any>
) {
    return res
        .status(errors.inputError?.name ? 400 : errors.checkError.status)
        .send(
            errors.inputError?.name
                ? 'HTTP 400 Bad Request: Something go wrong with the variables that you send'
                : errors.checkError.message
        )
}
