import { HttpProvider } from '../http/http.provider'
import { ISecurity } from './security.type'
import { UserProvider } from '../user/user.provider'
import { ValidationProvider } from '../validation/validation.provider'
import { ValidationRequest } from '../validation/validation.request'
import { HttpPolicy } from '../http/http.type'
import { PermissionProvider } from '../permission/permission.provider'

export class SecurityProvider {
    static async authorize(
        params: ISecurity.RestrictedParams,
        callback: ISecurity.RestrictedCallback
    ) {
        const { api, httpVerb, schemaValidation, permissionPolicies } = params
        return await HttpProvider.guard(api, [httpVerb], async () => {
            return await UserProvider.guard(api, async (session) => {
                return await ValidationProvider.guard(
                    {
                        ...api,
                        schema: schemaValidation,
                        requestValue:
                            httpVerb === HttpPolicy.Post
                                ? ValidationRequest.Body
                                : ValidationRequest.Query,
                    },
                    async () => {
                        return await PermissionProvider.guard(
                            {
                                session,
                                policies: permissionPolicies,
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
