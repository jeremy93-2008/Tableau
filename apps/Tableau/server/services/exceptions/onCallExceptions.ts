import { NextApiResponse } from 'next'
import { IErrorPromiseReject } from 'shared-libs/src/procedure'

export function onCallExceptions(
    res: NextApiResponse,
    errors: IErrorPromiseReject<any>
) {
    const checkError =
        errors.checkError &&
        errors.checkError.status &&
        errors.checkError.message
            ? errors.checkError
            : { status: 500, message: 'Something go wrong' }
    return res
        .status(errors.inputError?.name ? 400 : checkError.status)
        .send(
            errors.inputError?.name
                ? 'HTTP 400 Bad Request: Something go wrong with the variables that you send'
                : checkError.message
        )
}
