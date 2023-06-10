import React from 'react'
import { Avatar, Button, Flex, Text, Tooltip } from '@chakra-ui/react'
import { FaUserSlash } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { User } from '@prisma/client'
import { useThemeMode } from 'shared-hooks'

interface ITaskEditFormAssignedUserInnerButtonProps {
    assignedUsers: User[]
}

export function TaskEditFormAssignedUserInnerButton(
    props: ITaskEditFormAssignedUserInnerButtonProps
) {
    const { assignedUsers } = props

    const { assignedUser: themeAssignedUser } = useThemeMode()

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
                                bgColor={themeAssignedUser.bg}
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
                        label={`${assignedUser.name} (${assignedUser.email})`}
                    >
                        <Avatar
                            size="sm"
                            name={assignedUser.name ?? ''}
                            src={assignedUser.image ?? ''}
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
                        bgColor={themeAssignedUser.bg}
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
                    bgColor={themeAssignedUser.bg}
                    color={themeAssignedUser.text}
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
