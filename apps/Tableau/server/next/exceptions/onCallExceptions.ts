import { NextApiResponse } from 'next'
import { IErrorPromiseReject } from 'shared-libs'
import { getErrorObject } from '../../utils/getErrorObject'

export function onCallExceptions(
    res: NextApiResponse,
    errors: IErrorPromiseReject<any>
) {
    const checkErrorStatus =
        errors.checkError &&
        errors.checkError.status &&
        errors.checkError.message
            ? errors.checkError.status
            : 500

    return res
        .status(errors.inputError?.name ? 400 : checkErrorStatus)
        .send(getErrorObject(errors))
}
