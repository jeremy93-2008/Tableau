import { NextApiRequest, NextApiResponse } from 'next'
import { SafeParseError, z } from 'zod'
import { ValidationPolicy } from '../enums/validationPolicy'
import { ErrorMessage } from 'shared-utils'
import { setContextValue } from '../services/context'

export function ValidationMiddleware<TSchema>(
    schema: TSchema,
    requestDataType: ValidationPolicy
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const result = validateData(req, res, requestDataType, schema)

        if (result.success) {
            setContextValue('data', req[requestDataType])
            return true
        }

        if (process.env.NODE_ENV === 'production') {
            res.status(400).send(ErrorMessage.Forbidden)
            return false
        }

        res.status(400).send(
            (result.parseObject as SafeParseError<any>)!.error ??
                ErrorMessage.Forbidden
        )
        return false
    }
}

function validateData<TSchema>(
    req: NextApiRequest,
    res: NextApiResponse,
    requestDataType: ValidationPolicy,
    schema: TSchema
) {
    if (!req || !res) return { success: false }
    if (!schema) {
        console.warn('No schema provided for validation')
        return { success: true }
    }

    const parseObject = (schema as unknown as z.Schema).safeParse(
        req[requestDataType]
    )

    return {
        success: parseObject.success,
        parseObject,
    }
}
