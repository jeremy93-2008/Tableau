import { Flex } from '@chakra-ui/react'
import { Comment } from '.prisma/client'

interface ITaskEditFormMessageProps {
    comment: Comment
}

export function TaskEditFormMessage(props: ITaskEditFormMessageProps) {
    const { comment } = props
    return <Flex>{comment.message}</Flex>
}
