import React from 'react'
import { Avatar, Flex, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTaskAssignedUser } from 'shared-types/src/types'
import { useTableauQuery } from 'shared-hooks'
import { IFullBoardSharing } from '../../columnShare'
import { AiOutlineEllipsis } from 'react-icons/ai'

interface ITaskEditFormAssignedUserProps {
    assignedUsers?: IFullTaskAssignedUser[]
    setAssignedUser: (assignedUserIds: string[] | null) => void
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
        <Flex alignItems="center" flexDirection="column">
            <Flex width="100%" flex={1} pl={2} mb={1}>
                <Text size="sm">Assignees</Text>
            </Flex>
            <Flex
                onClick={() => {}}
                cursor="pointer"
                p={2}
                borderRadius="5px"
                _hover={{
                    bgColor: 'blackAlpha.300',
                }}
                _active={{
                    bgColor: 'blackAlpha.500',
                }}
            >
                {assignedUsers?.map((assignedUser, idx, assignedUsersArray) => {
                    if (idx === 3)
                        return (
                            <Tooltip
                                key={assignedUser.id + idx}
                                label="Click to see more information"
                            >
                                <Flex
                                    justifyContent="center"
                                    alignItems="center"
                                    bgColor="gray.600"
                                    borderRadius="50%"
                                    width="32px"
                                    height="32px"
                                    ml={-3}
                                >
                                    <Text fontSize="xs">
                                        +{assignedUsersArray?.length - 3}
                                    </Text>
                                </Flex>
                            </Tooltip>
                        )
                    if (idx > 2) return
                    return (
                        <Tooltip
                            key={assignedUser.id + idx}
                            label={`${assignedUser.User.name} (${assignedUser.User.email})`}
                        >
                            <Avatar
                                size="sm"
                                name={assignedUser.User.name ?? ''}
                                src={assignedUser.User.image ?? ''}
                                ml={idx > 0 ? -3 : 0}
                                zIndex={assignedUsersArray?.length - idx}
                            />
                        </Tooltip>
                    )
                })}
                <Tooltip label="Click to see more information">
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        bgColor="gray.600"
                        borderRadius="50%"
                        width="32px"
                        height="32px"
                        ml={1}
                    >
                        <AiOutlineEllipsis />
                    </Flex>
                </Tooltip>
            </Flex>
        </Flex>
    )
}
