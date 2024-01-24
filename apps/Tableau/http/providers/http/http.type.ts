import { NextApiRequest, NextApiResponse } from 'next'

export namespace IHttp {
    export interface Attempt {
        req: NextApiRequest
        res: NextApiResponse
        policies: HttpPolicy[]
    }
    export interface Guard {
        api: Omit<IHttp.Attempt, 'policies'>
        policies: HttpPolicy[]
        callback: (result: boolean) => any
    }
}

export enum HttpPolicy {
    Get = 'get',
    Post = 'post',
}
