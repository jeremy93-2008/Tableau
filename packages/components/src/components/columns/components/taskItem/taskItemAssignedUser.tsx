import { Avatar, Flex, Text, Tooltip } from '@chakra-ui/react'
import { FaUserSlash } from 'react-icons/fa'
import React from 'react'
import { IFullTask } from 'shared-types'

interface TaskItemAssignedUserProps {
    task: IFullTask
}

export function TaskItemAssignedUser(props: TaskItemAssignedUserProps) {
    const { task } = props

    return (
        <Flex
            position="absolute"
            right={-2}
            bottom={-2}
            className="board-item-actions"
        >
            {task.assignedUsers?.map(
                (assignedUser, idx, assignedUsersArray) => {
                    if (idx === 2)
                        return (
                            <Tooltip
                                key={assignedUser.id + idx}
                                label={assignedUsersArray
                                    .slice(2)
                                    .map((assigned) => assigned.User.name)
                                    .join(', ')}
                            >
                                <Flex
                                    justifyContent="center"
                                    alignItems="center"
                                    bgColor="gray.500"
                                    borderRadius="50%"
                                    width="32px"
                                    height="32px"
                                    ml={-3}
                                    _hover={{
                                        ml: 0,
                                    }}
                                >
                                    <Text fontSize="xs">
                                        +{assignedUsersArray?.length - 2}
                                    </Text>
                                </Flex>
                            </Tooltip>
                        )
                    if (idx > 1) return <></>
                    return (
                        <Tooltip
                            key={assignedUser.id + idx}
                            label={`${assignedUser.User.name} (${assignedUser.User.email})`}
                        >
                            <Avatar
                                name={assignedUser.User.name ?? ''}
                                src={assignedUser.User.image ?? ''}
                                ml={idx > 0 ? -3 : 0}
                                border="2px teal solid"
                                zIndex={assignedUsersArray?.length - idx}
                                width="36px"
                                height="36px"
                                _hover={{
                                    ml: 0,
                                }}
                            />
                        </Tooltip>
                    )
                }
            )}
            {task.assignedUsers?.length === 0 && (
                <Tooltip label="No user assigned">
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        bgColor="gray.400"
                        border="2px teal solid"
                        borderRadius="50%"
                        width="36px"
                        height="36px"
                    >
                        <FaUserSlash />
                    </Flex>
                </Tooltip>
            )}
        </Flex>
    )
}
