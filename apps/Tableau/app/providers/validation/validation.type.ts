import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { ValidationRequest } from './validation.request'

export namespace IValidation {
    export interface Attempt {
        req: NextApiRequest
        res: NextApiResponse
        requestValue: ValidationRequest
        schema: z.Schema<any>
    }
    export interface Guard {
        api: IValidation.Attempt
        callback: (result: z.Schema<any>) => any
    }
}
