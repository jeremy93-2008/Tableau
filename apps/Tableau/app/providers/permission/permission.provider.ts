import { PermissionPolicy, IPermission } from './permission.type'
import prisma from '../../../lib/prisma'
import { Role } from '../../policies/role/role.type'
import { RolePolicy } from '../../policies/role/role.policy'

export class PermissionProvider {
    private static async getCurrentUserRole({
        session,
        boardId,
    }: IPermission.GetRoles) {
        const currentBoard = await prisma.board.findFirst({
            where: { id: boardId },
            include: {
                user: true,
            },
        })

        if (currentBoard?.user.email === session.user.email) return Role.Owner

        const roleForBoardOfCurrentUser =
            await prisma.boardUserSharing.findFirst({
                where: { user: { email: session.user.email }, boardId },
                include: {
                    board: {
                        include: {
                            user: true,
                        },
                    },
                },
            })

        if (!roleForBoardOfCurrentUser) return Role.Guest

        if (
            roleForBoardOfCurrentUser.canEditContent &&
            roleForBoardOfCurrentUser.canEditSchema &&
            roleForBoardOfCurrentUser.board.user.email === session.user.email
        )
            return Role.Owner

        if (
            roleForBoardOfCurrentUser.canEditContent &&
            roleForBoardOfCurrentUser.canEditSchema
        )
            return Role.Administrator

        if (roleForBoardOfCurrentUser.canEditContent) return Role.Collaborator

        return Role.Guest
    }

    static async attempt({ session, policies, params }: IPermission.Attempt) {
        if (!session) return false

        // As a user you always have access to your own boards
        if (policies.includes(PermissionPolicy.ReadBoardList)) return true

        //If not we need to have a boardId to check the policies
        if (!params || !params.boardId) return false

        const roleOfCurrentUserOnBoard = await this.getCurrentUserRole({
            session,
            boardId: params.boardId,
        })

        const policiesOfCurrentRole = RolePolicy[roleOfCurrentUserOnBoard]

        return policies.every((policy) =>
            policiesOfCurrentRole.includes(policy)
        )
    }

    static async guard(
        { session, policies, params }: IPermission.Guard['api'],
        success: IPermission.Guard['success'],
        fail?: IPermission.Guard['fail']
    ) {
        const result = await this.attempt({ session, policies, params })

        if (result) return success(result)

        return fail?.(result)
    }
}
