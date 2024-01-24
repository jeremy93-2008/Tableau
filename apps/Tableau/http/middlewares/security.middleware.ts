import { PermissionPolicy } from '../providers/permission/permission.type'
import { ValidationValueType } from '../providers/validation/validation.value.type'
import { HttpPolicy } from '../providers/http/http.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthMiddleware } from './auth.middleware'
import { HttpMiddleware } from './http.middleware'
import { PermissionMiddleware } from './permission.middleware'
import { ValidationMiddleware } from './validation.middleware'

interface ISecurityMiddleware {
    verbs: HttpPolicy[]
    policies: PermissionPolicy[]
    requestDataType: ValidationValueType
    schema: any
}

export function SecurityMiddleware<TSchema>(props: ISecurityMiddleware) {
    const { verbs, policies, requestDataType, schema } = props
    return async (req: NextApiRequest, res: NextApiResponse) => {
        return (
            HttpMiddleware(verbs)(req, res) &&
            (await AuthMiddleware()(req, res)) &&
            (await PermissionMiddleware(policies, requestDataType)(req, res)) &&
            (await ValidationMiddleware(schema, requestDataType)(req, res))
        )
    }
}
