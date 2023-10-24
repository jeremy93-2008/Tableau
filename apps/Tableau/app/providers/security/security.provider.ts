import { HttpProvider } from '../http/http.provider'
import { ISecurity } from './security.type'
import { UserProvider } from '../user/user.provider'
import { ValidationProvider } from '../validation/validation.provider'
import { ValidationValueType } from '../validation/validation.value.type'
import { PermissionProvider } from '../permission/permission.provider'

export class SecurityProvider {
    static async authorize<TSchema>(
        params: ISecurity.AuthorizeParams,
        callback: ISecurity.AuthorizeCallback<TSchema>
    ) {
        const { api, policies, validations } = params
        return await HttpProvider.guard(api, [policies.http], async () => {
            return await UserProvider.guard(api, async (session) => {
                return await ValidationProvider.guard<TSchema>(
                    {
                        ...api,
                        schema: validations.schema as TSchema,
                        requestValue:
                            validations.valueType ?? ValidationValueType.Body,
                    },
                    async (data) => {
                        return await PermissionProvider.guard(
                            {
                                session,
                                policies: policies.permissions,
                                params: {
                                    boardId: validations.boardId,
                                },
                                res: api.res,
                            },
                            async () => {
                                return callback(session, data)
                            }
                        )
                    }
                )
            })
        })
    }
}
