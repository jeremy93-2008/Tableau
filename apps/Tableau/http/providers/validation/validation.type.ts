import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { ValidationValueType } from './validation.value.type'

export namespace IValidation {
    export interface Attempt<TSchema> {
        req: NextApiRequest
        res: NextApiResponse
        requestValue: ValidationValueType
        schema: TSchema
    }
    export interface Guard<TSchema> {
        api: IValidation.Attempt<TSchema>
        callback: (result: TSchema) => any
    }
}
