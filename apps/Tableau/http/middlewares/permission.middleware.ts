import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorMessage } from 'shared-utils'
import { getContext } from '../services/context'
import prisma from '../../lib/prisma'
import { Role } from '../enums/role.enum'
import { Session } from 'next-auth'
import { PermissionPolicy } from '../enums/permission.enum'
import { RolePolicy } from '../policies/role/role.policy'
import { ValidationPolicy } from '../enums/validationPolicy'

export function PermissionMiddleware(
    policies: PermissionPolicy[],
    requestDataType: ValidationPolicy
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const session = getContext('session') as Session | undefined

        if (!session) {
            res.status(401).send(ErrorMessage.Unauthenticated)
            return false
        }

        const { result, role, rolePolicies, earlyReturnReason } =
            await checkPermission(session, policies, req[requestDataType])

        if (result) return true

        const errorMessageDev = `You don't have permission to access this resource. You need to have one of the following permissions: ${policies.join(
            ', '
        )}, and right now you have ${rolePolicies.join(
            ', '
        )} and you role is at least ${role}, the reason is ${earlyReturnReason} `

        const errorMessageProd = ErrorMessage.Forbidden

        const errorMessage =
            process.env.NODE_ENV === 'development'
                ? errorMessageDev
                : errorMessageProd

        res.status(403).send(errorMessage)

        return false
    }
}

async function checkPermission(
    session: Session,
    policies: PermissionPolicy[],
    params?: Record<string, any> & { boardId: string | undefined }
) {
    if (!session)
        return {
            result: false,
            role: Role.Guest,
            rolePolicies: RolePolicy[Role.Guest],
            earlyReturn: true,
            earlyReturnReason: "You don't have a session to check the policies",
        }

    // If policies is empty, we don't need to check anything
    if (!policies || !policies.length)
        return {
            result: true,
            role: Role.Guest,
            rolePolicies: RolePolicy[Role.Guest],
            earlyReturn: true,
            earlyReturnReason: "You don't have any policies to check",
        }

    // As a user you always have access to your own boards
    if (
        policies.includes(PermissionPolicy.ReadBoardList) &&
        policies.length === 1
    )
        return {
            result: true,
            role: Role.Owner,
            rolePolicies: RolePolicy[Role.Owner],
            earlyReturn: true,
            earlyReturnReason: "ReadBoardList doesn't need a boardId",
        }

    //If not we need to have a boardId to check the policies
    if (!params || !params.boardId)
        return {
            result: false,
            role: Role.Guest,
            rolePolicies: RolePolicy[Role.Guest],
            earlyReturn: true,
            earlyReturnReason: "You don't have a boardId to check the policies",
        }

    const roleOfCurrentUserOnBoard = await getCurrentUserRole(
        session,
        params.boardId
    )

    const policiesOfCurrentRole = RolePolicy[roleOfCurrentUserOnBoard]

    return {
        result: policies.every((policy) =>
            policiesOfCurrentRole.includes(policy)
        ),
        role: roleOfCurrentUserOnBoard,
        rolePolicies: policiesOfCurrentRole,
        earlyReturn: false,
        earlyReturnReason: null,
    }
}

async function getCurrentUserRole(session: Session, boardId: string) {
    const currentBoard = await prisma.board.findFirst({
        where: { id: boardId },
        include: {
            user: true,
        },
    })

    if (currentBoard?.user.email === session.user.email) return Role.Owner

    const roleForBoardOfCurrentUser = await prisma.boardUserSharing.findFirst({
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
