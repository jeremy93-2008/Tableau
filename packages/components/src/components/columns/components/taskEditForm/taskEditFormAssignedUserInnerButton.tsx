import React from 'react'
import { Avatar, Button, Flex, Text, Tooltip } from '@chakra-ui/react'
import { FaUserSlash } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { ITaskEditFormAssignedUserProps } from './taskEditFormAssignedUser'

interface ITaskEditFormAssignedUserInnerButtonProps
    extends Omit<ITaskEditFormAssignedUserProps, 'setAssignedUser'> {}

export function TaskEditFormAssignedUserInnerButton(
    props: ITaskEditFormAssignedUserInnerButtonProps
) {
    const { assignedUsers } = props
    return (
        <Flex>
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
                if (idx > 2) return <></>
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
            {assignedUsers?.length === 0 && (
                <Tooltip label="No user assigned">
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        bgColor="gray.600"
                        borderRadius="50%"
                        width="32px"
                        height="32px"
                    >
                        <FaUserSlash />
                    </Flex>
                </Tooltip>
            )}
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
    )
}
