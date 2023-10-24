import { HttpPolicy } from '../http/http.type'
import { ZodSchema } from 'zod'
import { PermissionPolicy } from '../permission/permission.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { ValidationValueType } from '../validation/validation.value.type'

export namespace ISecurity {
    export interface AuthorizeParams {
        api: {
            req: NextApiRequest
            res: NextApiResponse
        }
        policies: {
            http: HttpPolicy
            permissions: PermissionPolicy[]
        }
        validations: {
            schema: ZodSchema<any>
            valueType?: ValidationValueType
            boardId?: string
        }
    }

    export type AuthorizeCallback<TSchema> = (
        session: Session,
        data: TSchema
    ) => void
}
