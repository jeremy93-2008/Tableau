import { PermissionPolicy, IPermission } from './permission.type'
import prisma from '../../../lib/prisma'
import { Role } from '../../policies/role/role.type'
import { RolePolicy } from '../../policies/role/role.policy'
import { ErrorMessage } from 'shared-utils'

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

    static async attempt({
        session,
        policies,
        params,
    }: Omit<IPermission.Attempt, 'res'>) {
        if (!session) return false

        // As a user you always have access to your own boards
        if (
            policies.includes(PermissionPolicy.ReadBoardList) &&
            policies.length === 1
        )
            return true

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
        { session, policies, params, res }: IPermission.Guard['api'],
        success: IPermission.Guard['success']
    ) {
        const result = await this.attempt({ session, policies, params })

        if (result) return success(result)

        return res.status(403).send(ErrorMessage.Forbidden)
    }
}
