import { AuthGetProcedure } from './AuthGetProcedure'
import { AuthPostPermissionProcedure } from './AuthPostPermissionProcedure'
import { AuthPostProcedure } from './AuthPostProcedure'

export const Authenticate = {
    Get: AuthGetProcedure,
    Permission: {
        Post: AuthPostPermissionProcedure,
    },
    Post: AuthPostProcedure,
}
