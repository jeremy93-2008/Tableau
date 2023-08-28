import React, { useMemo } from 'react'
import {
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { useTableauQuery, useThemeMode } from 'shared-hooks'
import { IFullBoardSharing } from '../../../columnShare'
import { TaskEditFormAssignedUserInnerButton } from './taskEditFormAssignedUserInnerButton'
import { TaskEditFormAssignedUserList } from './taskEditFormAssignedUserList'
import { User } from '@prisma/client'

export interface ITaskEditFormAssignedUserProps {
    assignedUsersIds?: string[]
    setAssignedUser: (assignedUserIds: string[] | null) => void
}

export function TaskEditFormAssignedUser(
    props: ITaskEditFormAssignedUserProps
) {
    const { assignedUsersIds, setAssignedUser } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const { assignedUser: themeAssignedUser } = useThemeMode()

    const { data, isLoading } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            noLoading: true,
        }
    )

    const assignedUsers = useMemo(() => {
        return assignedUsersIds
            ?.map((assignedUserId) => {
                return data?.find(
                    (boardSharing) => boardSharing.userId === assignedUserId
                )?.user
            })
            .filter((user) => user) as User[]
    }, [assignedUsersIds, data])

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    return (
        <Flex alignItems="center" flexDirection="column">
            <Flex width="100%" flex={1} pl={2} mb={1}>
                <Text size="sm">Assignees</Text>
            </Flex>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button
                        colorScheme={themeAssignedUser.colorScheme}
                        bgColor="transparent"
                        color={themeAssignedUser.text}
                    >
                        <TaskEditFormAssignedUserInnerButton
                            assignedUsers={assignedUsers}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        {!isLoading && (
                            <TaskEditFormAssignedUserList
                                boardSharings={data!}
                                assignedUsers={assignedUsers}
                                setAssignedUser={setAssignedUser}
                            />
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}
