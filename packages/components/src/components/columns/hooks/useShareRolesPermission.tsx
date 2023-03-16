import { useMemo } from 'react'
import { IFullBoardSharing } from 'shared-types'
import { useTableauQuery } from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'

interface IPermissionShareableRoles {
    permissions: {
        add: boolean
        userBoardSharing: [string, { edit: boolean; delete: boolean }][]
    }
}

interface IReturnPermissionShareableRoles {
    permissions: {
        add: boolean
        userBoardSharing: Map<string, { edit: boolean; delete: boolean }>
    }
}
export function useShareRolesPermission(
    boardsSharedUser: IFullBoardSharing[]
): IReturnPermissionShareableRoles | { permissions: null } {
    const [selectedBoard] = useAtom(BoardAtom)
    const { data } = useTableauQuery<IPermissionShareableRoles>(
        [
            'api/permissions/share',
            {
                boardId: selectedBoard?.id,
                userBoardSharing: boardsSharedUser
                    .map((boardSharedUser) => boardSharedUser.id)
                    .join(','),
            },
        ],
        {
            enabled: !!selectedBoard?.id && !!boardsSharedUser,
            loadingKey: 'sharing',
        }
    )

    return useMemo(() => {
        if (!data) return { permissions: null }
        return {
            permissions: {
                add: data.permissions.add,
                userBoardSharing: new Map(data.permissions.userBoardSharing),
            },
        } as IReturnPermissionShareableRoles
    }, [data])
}
