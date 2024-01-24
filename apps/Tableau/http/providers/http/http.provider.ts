import { HttpPolicy, IHttp } from './http.type'
import { ErrorMessage } from 'shared-utils'

export class HttpProvider {
    static async attempt({ req, policies }: IHttp.Attempt) {
        if (!req) return false
        const method = req.method?.toLowerCase() as HttpPolicy
        return policies.includes(method)
    }
    static async guard(
        api: IHttp.Guard['api'],
        policies: IHttp.Guard['policies'],
        callback: IHttp.Guard['callback']
    ) {
        const result = await this.attempt({ ...api, policies })
        if (result) return callback(result)
        return api.res.status(405).send(ErrorMessage.NotAllowed)
    }
}
