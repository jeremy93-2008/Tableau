import React from 'react'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTaskAssignedUser } from 'shared-types/src/types'
import { useTableauQuery } from 'shared-hooks'
import { IFullBoardSharing } from './columnShare'

interface ITaskEditFormAssignedUserProps {
    assignedUsers?: IFullTaskAssignedUser[]
    setAssignedUser: (assignedUserId: string | null) => void
}

export function TaskEditFormAssignedUser(
    props: ITaskEditFormAssignedUserProps
) {
    const { assignedUsers, setAssignedUser } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const { data } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            noLoading: true,
        }
    )

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex alignItems="center">
            {JSON.stringify(
                assignedUsers?.map((assigned) => assigned.User.name)
            )}
        </Flex>
    )
}
