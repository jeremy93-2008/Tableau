import React, { useCallback, useState } from 'react'
import { FormikProps } from 'formik'
import { Flex, useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { useTableauMutation } from 'shared-hooks'
import { IFullTask } from 'shared-types'
import { TaskEditFormMessageInputType } from '../../components/taskEditFormMessageInputType'
import { TaskEditFormMessage } from '../../components/taskEditFormMessage'
import { ITaskEditFormikValues } from '../../../../taskEdit'

import axios from 'axios'
import { useAtom } from 'jotai'
import { flushSync } from 'react-dom'

interface ITaskEditFormCommentsProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
}

export type ICommentCreateFormikValues = {
    boardId: string
    taskId: string
    email: string
    message: string
}

export function TaskEditFormComments(props: ITaskEditFormCommentsProps) {
    const { task } = props

    const [inputMessage, setInputMessage] = useState('')

    const onChangeMessage = useCallback(
        (newValue: string) => {
            setInputMessage(newValue)
        },
        [setInputMessage]
    )

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { data: session } = useSession()

    const { mutateAsync } = useTableauMutation(
        (values: ICommentCreateFormikValues) => {
            return axios.post(`api/comment/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const toast = useToast()

    const onSendMessage = useCallback(() => {
        if (!selectedBoard) return
        if (!inputMessage.trim()) {
            return toast({
                id: 'empty-message',
                status: 'error',
                title: 'Message cannot be empty',
                description: 'Please type a message',
                isClosable: true,
                duration: 3000,
            })
        }
        mutateAsync({
            boardId: selectedBoard.id,
            taskId: task.id,
            email: session?.user.email ?? '',
            message: inputMessage,
        }).then(() => {
            setInputMessage('')
            refetchBoards.fetch()
        })
    }, [
        selectedBoard,
        inputMessage,
        toast,
        mutateAsync,
        task.id,
        session?.user.email,
        refetchBoards,
    ])

    return (
        <Flex flexDirection="column" maxH="65vh" minH="10vw">
            <Flex
                flexDirection="column"
                flex={1}
                maxH="35vh"
                overflowY="auto"
                px={3}
                onWheel={(evt) => evt.stopPropagation()}
            >
                <Flex flexDirection="column">
                    {task.Comment.map((comment) => (
                        <TaskEditFormMessage
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                </Flex>
            </Flex>
            <Flex alignItems="flex-end" gap={2} position="relative">
                <TaskEditFormMessageInputType
                    value={inputMessage}
                    onChange={onChangeMessage}
                    onSend={onSendMessage}
                />
            </Flex>
        </Flex>
    )
}
