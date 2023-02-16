export interface IPermission {
    add: boolean
    edit: boolean
    move: boolean
    delete: boolean
    read: boolean
}

export type IKeyPermission = keyof IPermission
