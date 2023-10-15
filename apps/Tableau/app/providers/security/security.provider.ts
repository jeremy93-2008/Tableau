import { HttpProvider } from '../http/http.provider'
import { ISecurity } from './security.type'
import { UserProvider } from '../user/user.provider'
import { ValidationProvider } from '../validation/validation.provider'
import { ValidationRequest } from '../validation/validation.request'
import { HttpPolicy } from '../http/http.type'
import { PermissionProvider } from '../permission/permission.provider'

export class SecurityProvider {
    static async authorize(
        params: ISecurity.AuthorizeParams,
        callback: ISecurity.AuthorizeCallback
    ) {
        const { api, policies, validations } = params
        return await HttpProvider.guard(api, [policies.http], async () => {
            return await UserProvider.guard(api, async (session) => {
                return await ValidationProvider.guard(
                    {
                        ...api,
                        schema: validations.schema,
                        requestValue:
                            policies.http === HttpPolicy.Post
                                ? ValidationRequest.Body
                                : ValidationRequest.Query,
                    },
                    async () => {
                        return await PermissionProvider.guard(
                            {
                                session,
                                policies: policies.permissions,
                            },
                            async () => {
                                return callback(session)
                            }
                        )
                    }
                )
            })
        })
    }
}
