import { ITaskEditFormAssignedUserProps } from './taskEditFormAssignedUser'
import { IFullBoardSharing } from '../../columnShare'
import { Avatar, Checkbox, Flex, Text } from '@chakra-ui/react'

interface ITaskEditFormAssignedUserListProps
    extends ITaskEditFormAssignedUserProps {
    boardSharings: IFullBoardSharing[]
}

export function TaskEditFormAssignedUserList(
    props: ITaskEditFormAssignedUserListProps
) {
    const { boardSharings, assignedUsers } = props

    return (
        <Flex
            onWheel={(evt) => evt.stopPropagation()}
            maxHeight="150px"
            overflow="auto"
            flexDirection="column"
            gap={2}
        >
            {boardSharings.map((boardSharing, idx, loopBoardSharing) => {
                const isAssigned = assignedUsers?.some(
                    (assignedUser) =>
                        assignedUser.userId === boardSharing.userId
                )

                return (
                    <Flex key={boardSharing.id} flexDirection="column" gap={1}>
                        <Flex
                            key={boardSharing.userId}
                            mx={2}
                            alignItems="center"
                        >
                            <Checkbox
                                defaultChecked={isAssigned}
                                colorScheme="teal"
                                mr={2}
                            />
                            <Avatar
                                size="sm"
                                name={boardSharing.user.name ?? ''}
                                src={boardSharing.user.image ?? ''}
                            />
                            <Text ml={1}>{boardSharing.user.name}</Text>
                        </Flex>
                        {idx < loopBoardSharing.length - 1 && (
                            <Flex
                                width="100%"
                                height={'1px'}
                                bgColor="gray.800"
                            />
                        )}
                    </Flex>
                )
            })}
        </Flex>
    )
}
