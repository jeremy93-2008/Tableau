import { PermissionPolicy } from '../providers/permission/permission.type'
import { ValidationValueType } from '../providers/validation/validation.value.type'
import { HttpPolicy } from '../providers/http/http.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { HttpMiddleware } from './http.middleware'
import { PermissionMiddleware } from './permission.middleware'
import { ValidationMiddleware } from './validation.middleware'
import { AuthMiddleware } from './auth.middleware'

interface ISecurityMiddleware<TSchema> {
    verbs: HttpPolicy[]
    policies: PermissionPolicy[]
    requestDataType?: ValidationValueType
    schema: TSchema
}

export function SecurityMiddleware<TSchema>(
    props: ISecurityMiddleware<TSchema>
) {
    const { verbs, policies, requestDataType, schema } = props
    return async (req: NextApiRequest, res: NextApiResponse) => {
        return (
            HttpMiddleware(verbs)(req, res) &&
            (await AuthMiddleware()(req, res)) &&
            (await PermissionMiddleware(
                policies,
                requestDataType ?? ValidationValueType.Body
            )(req, res)) &&
            (await ValidationMiddleware(
                schema,
                requestDataType ?? ValidationValueType.Body
            )(req, res))
        )
    }
}
