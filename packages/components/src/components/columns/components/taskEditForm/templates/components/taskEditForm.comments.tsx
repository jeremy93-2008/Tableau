import React, { useCallback, useEffect, useState } from 'react'
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
import { TaskEditFormButtonRefresh } from '../../components/taskEditFormButtonRefresh'

interface ITaskEditFormCommentsProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
    isVisible: boolean
}

export type ICommentCreateFormikValues = {
    boardId: string
    taskId: string
    email: string
    message: string
}

export function TaskEditFormComments(props: ITaskEditFormCommentsProps) {
    const { task, isVisible } = props

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

    const refScrollCommentsContainer = React.useRef<HTMLDivElement>(null)

    const resetScroll = useCallback(() => {
        if (!refScrollCommentsContainer.current) return
        refScrollCommentsContainer.current.scrollTop =
            refScrollCommentsContainer.current.scrollHeight
    }, [refScrollCommentsContainer])

    useEffect(() => {
        if (!isVisible) return
        resetScroll()
    }, [isVisible, resetScroll, task])

    const onRefresh = useCallback(async () => {
        await refetchBoards.fetch()
        resetScroll()
    }, [resetScroll, refetchBoards])

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
            onRefresh().then()
        })
    }, [
        selectedBoard,
        inputMessage,
        mutateAsync,
        task.id,
        session?.user.email,
        toast,
        onRefresh,
    ])

    useEffect(() => {
        const intervalFetchMessage = window.setInterval(() => {
            onRefresh().then()
        }, 60000)

        return () => {
            window.clearInterval(intervalFetchMessage)
        }
    }, [])

    return (
        <Flex
            id="comments-container"
            position="relative"
            flexDirection="column"
            height="35vh"
        >
            <TaskEditFormButtonRefresh onRefresh={onRefresh} />
            <Flex
                ref={refScrollCommentsContainer}
                flexDirection="column"
                flex={1}
                overflowY="auto"
                px={3}
                onWheel={(evt) => evt.stopPropagation()}
            >
                <Flex flexDirection="column">
                    {task.Comment.map((comment, idx) => {
                        return (
                            <TaskEditFormMessage
                                key={comment.id}
                                comment={comment}
                            />
                        )
                    })}
                </Flex>
            </Flex>
            <Flex alignItems="flex-end" gap={2} mt={2} position="relative">
                <TaskEditFormMessageInputType
                    value={inputMessage}
                    onChange={onChangeMessage}
                    onSend={onSendMessage}
                />
            </Flex>
        </Flex>
    )
}
