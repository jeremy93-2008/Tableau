import { IValidation } from './validation.type'
import { ErrorMessage } from 'shared-utils'
import { SafeParseError, z } from 'zod'

export class ValidationProvider {
    static async attempt<TSchema>({
        req,
        res,
        requestValue,
        schema,
    }: IValidation.Attempt<TSchema>) {
        if (!req || !res) return { success: false }
        if (!schema) {
            console.warn('No schema provided for validation')
            return { success: true }
        }

        const parseObject = (schema as unknown as z.Schema).safeParse(
            req[requestValue]
        )

        return {
            success: parseObject.success,
            parseObject,
        }
    }

    static async guard<TSchema>(
        api: IValidation.Guard<TSchema>['api'],
        callback: IValidation.Guard<TSchema>['callback']
    ) {
        const result = await this.attempt(api)

        if (result.success)
            return callback(api.req[api.requestValue] as unknown as TSchema)

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
