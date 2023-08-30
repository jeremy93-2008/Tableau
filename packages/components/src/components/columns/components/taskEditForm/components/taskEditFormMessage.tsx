import { Avatar, Flex, Text, Tooltip } from '@chakra-ui/react'
import { IFullComment } from 'shared-types'
import { useSession } from 'next-auth/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
import { getDateAndTimeString } from '../utils/getDateAndTimeString'

interface ITaskEditFormMessageProps {
    comment: IFullComment
}

export function TaskEditFormMessage(props: ITaskEditFormMessageProps) {
    const { comment } = props
    const { data: session } = useSession()

    const isSameUser = session?.user.email === comment.user.email

    return (
        <Flex
            className="messages-container"
            position="relative"
            flex={1}
            my={1}
            justifyContent={isSameUser ? 'right' : 'left'}
            alignItems="center"
        >
            {!isSameUser && (
                <>
                    <Tooltip label={`${comment.user.name}`}>
                        <Avatar
                            ml={1}
                            size="sm"
                            src={comment.user.image ?? ''}
                        />
                    </Tooltip>
                    <TriangleDownIcon
                        fontSize="xs"
                        color="teal.800"
                        transform="rotate(90deg)"
                    />
                </>
            )}
            <Flex
                flexDirection="column"
                bgColor={isSameUser ? 'gray.800' : 'teal.800'}
                ml={isSameUser ? 0 : -1}
                px={2}
                py={1}
                width="50%"
                borderRadius="5px"
                userSelect="contain"
            >
                <Text mx={2} my={1}>
                    {comment.message}
                </Text>
                <Text
                    alignSelf="flex-end"
                    color={isSameUser ? 'gray.400' : 'teal.200'}
                    fontSize="xs"
                >
                    {getDateAndTimeString(new Date(comment.createdAt))}
                </Text>
            </Flex>
            {isSameUser && (
                <>
                    <TriangleDownIcon
                        fontSize="xs"
                        ml={-1}
                        color="gray.800"
                        transform="rotate(-90deg)"
                    />
                    <Tooltip label={`${session?.user.name} (You)`}>
                        <Avatar ml={1} size="sm" src={session?.user.image} />
                    </Tooltip>
                </>
            )}
        </Flex>
    )
}
