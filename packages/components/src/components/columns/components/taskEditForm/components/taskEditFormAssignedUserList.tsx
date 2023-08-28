import { ITaskEditFormAssignedUserProps } from './taskEditFormAssignedUser'
import { IFullBoardSharing } from '../../../columnShare'
import { Avatar, Checkbox, Flex, Text } from '@chakra-ui/react'
import { useThemeMode } from 'shared-hooks'
import { User } from '@prisma/client'

interface ITaskEditFormAssignedUserListProps
    extends Omit<ITaskEditFormAssignedUserProps, 'assignedUsersIds'> {
    assignedUsers: User[]
    boardSharings: IFullBoardSharing[]
}

export function TaskEditFormAssignedUserList(
    props: ITaskEditFormAssignedUserListProps
) {
    const { boardSharings, assignedUsers, setAssignedUser } = props

    const { assignedUser: themeAssignedUser } = useThemeMode()

    const onClickToggleAssignedUser = (
        userId: string,
        newCheckedState: boolean
    ) => {
        const newAssignedUserIds =
            assignedUsers
                ?.filter((assignedUser) => {
                    return assignedUser.id !== userId
                })
                .map((assignedUser) => assignedUser.id) ?? []

        if (newCheckedState) newAssignedUserIds.push(userId)

        setAssignedUser(newAssignedUserIds)
    }

    return (
        <Flex
            onWheel={(evt) => evt.stopPropagation()}
            maxHeight="150px"
            overflow="auto"
            flexDirection="column"
            gap={1}
        >
            {boardSharings.map((boardSharing, idx, loopBoardSharing) => {
                const isAssigned = assignedUsers?.some(
                    (assignedUser) => assignedUser.id === boardSharing.userId
                )

                return (
                    <Flex key={boardSharing.id} flexDirection="column" gap={1}>
                        <Flex
                            onClick={() =>
                                onClickToggleAssignedUser(
                                    boardSharing.userId,
                                    !isAssigned
                                )
                            }
                            borderRadius="5px"
                            alignItems="center"
                            cursor="pointer"
                            mx={2}
                            py={1}
                            px={2}
                            _hover={{
                                bgColor: themeAssignedUser.hover,
                            }}
                        >
                            <Checkbox
                                isChecked={isAssigned}
                                colorScheme="teal"
                                mr={3}
                            />
                            <Avatar
                                size="sm"
                                name={boardSharing.user.name ?? ''}
                                src={boardSharing.user.image ?? ''}
                            />
                            <Text ml={2}>
                                {boardSharing.user.name}
                                <Text fontSize="xs">
                                    ({boardSharing.user.email})
                                </Text>
                            </Text>
                        </Flex>
                        {idx < loopBoardSharing.length - 1 && (
                            <Flex
                                width="100%"
                                height={'1px'}
                                bgColor={themeAssignedUser.separator}
                            />
                        )}
                    </Flex>
                )
            })}
        </Flex>
    )
}
