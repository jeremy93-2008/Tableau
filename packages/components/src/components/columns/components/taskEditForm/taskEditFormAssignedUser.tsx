import React from 'react'
import {
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTaskAssignedUser } from 'shared-types/src/types'
import { useTableauQuery } from 'shared-hooks'
import { IFullBoardSharing } from '../../columnShare'
import { TaskEditFormAssignedUserInnerButton } from './taskEditFormAssignedUserInnerButton'
import { TaskEditFormAssignedUserList } from './taskEditFormAssignedUserList'
export interface ITaskEditFormAssignedUserProps {
    assignedUsers?: IFullTaskAssignedUser[]
    setAssignedUser: (assignedUserIds: string[] | null) => void
}

export function TaskEditFormAssignedUser(
    props: ITaskEditFormAssignedUserProps
) {
    const { assignedUsers, setAssignedUser } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const { data, isLoading } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            noLoading: true,
        }
    )

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    return (
        <Flex alignItems="center" flexDirection="column">
            <Flex width="100%" flex={1} pl={2} mb={1}>
                <Text size="sm">Assignees</Text>
            </Flex>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button
                        colorScheme="blackAlpha"
                        bgColor="transparent"
                        color="white"
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
