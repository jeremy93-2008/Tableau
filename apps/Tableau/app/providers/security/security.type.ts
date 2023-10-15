import { HttpPolicy } from '../http/http.type'
import { ZodSchema } from 'zod'
import { PermissionPolicy } from '../permission/permission.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

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
        }
    }

    export type AuthorizeCallback = (session: Session) => void
}
