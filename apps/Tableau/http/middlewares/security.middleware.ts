import { PermissionPolicy } from '../enums/permission.enum'
import { ValidationPolicy } from '../enums/validationPolicy'
import { HttpPolicy } from '../enums/http.enum'
import { NextApiRequest, NextApiResponse } from 'next'
import { HttpMiddleware } from './http.middleware'
import { PermissionMiddleware } from './permission.middleware'
import { ValidationMiddleware } from './validation.middleware'
import { AuthMiddleware } from './auth.middleware'

interface ISecurityMiddleware<TSchema> {
    verbs: HttpPolicy[]
    policies: PermissionPolicy[]
    requestDataType?: ValidationPolicy
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
                requestDataType ?? ValidationPolicy.Body
            )(req, res)) &&
            (await ValidationMiddleware(
                schema,
                requestDataType ?? ValidationPolicy.Body
            )(req, res))
        )
    }
}
