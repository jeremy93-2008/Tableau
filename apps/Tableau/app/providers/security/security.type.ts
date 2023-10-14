import { HttpPolicy } from '../http/http.type'
import { ZodSchema } from 'zod'
import { PermissionPolicy } from '../permission/permission.type'
import { NextApiRequest, NextApiResponse } from 'next'

export namespace ISecurity {
    export interface RestrictedParams {
        api: {
            req: NextApiRequest
            res: NextApiResponse
        }
        httpVerb: HttpPolicy
        schemaValidation: ZodSchema
        permissionPolicies: PermissionPolicy[]
    }

    export type RestrictedCallback = () => void
}
