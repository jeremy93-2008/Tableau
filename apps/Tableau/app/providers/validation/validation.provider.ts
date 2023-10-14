import { IValidation } from './validation.type'
import { ErrorMessage } from 'shared-utils'
import { SafeParseError } from 'zod'

export class ValidationProvider {
    static async attempt({
        req,
        res,
        requestValue,
        schema,
    }: IValidation.Attempt) {
        if (!req || !res) return { success: false }
        if (!schema) {
            console.warn('No schema provided for validation')
            return { success: true }
        }

        const parseObject = schema.safeParse(req[requestValue])

        return {
            success: parseObject.success,
            parseObject,
        }
    }

    static async guard(
        api: IValidation.Guard['api'],
        callback: IValidation.Guard['callback']
    ) {
        const result = await this.attempt(api)

        if (result.success) return callback(api.req[api.requestValue])

        if (process.env.NODE_ENV === 'production')
            return api.res.status(400).send(ErrorMessage.Forbidden)

        return api.res
            .status(400)
            .send(
                (result.parseObject as SafeParseError<any>)!.error ??
                    ErrorMessage.Forbidden
            )
    }
}
