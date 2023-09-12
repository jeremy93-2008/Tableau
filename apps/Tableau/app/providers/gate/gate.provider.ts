import { GatePolicy, IGate } from './gate.type'
import prisma from '../../../lib/prisma'
import { Role } from '../../policies/role/role.type'
import { RolePolicy } from '../../policies/role/role.policy'

export class GateProvider {
    private static async getRoles({ session, boardId }: IGate.GetRoles) {
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

    static async attempt({ session, policies, params }: IGate.Attempt) {
        if (!params || !session) return false

        // As a user you always have access to your own boards
        if (policies.includes(GatePolicy.ReadBoardList)) return true

        //If not we need to have a boardId to check the policies
        if (!params.boardId) return false

        const roleOfCurrentUserOnBoard = await this.getRoles({
            session,
            boardId: params.boardId,
        })

        const policiesOfCurrentRole = RolePolicy[roleOfCurrentUserOnBoard]

        return policies.every((policy) =>
            policiesOfCurrentRole.includes(policy)
        )
    }

    static async guard(
        { session, policies, params }: IGate.Guard['api'],
        success: IGate.Guard['success'],
        fail?: IGate.Guard['fail']
    ) {
        const result = await this.attempt({ session, policies, params })

        if (result) return success(result)

        return fail?.(result)
    }
}
