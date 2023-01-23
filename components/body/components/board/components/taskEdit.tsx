import React, { useCallback } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import { FormikHelpers } from 'formik'
import { Status, Task } from '.prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from '../../../../../constants/url'
import { useAtom } from 'jotai'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'
import { TaskEditForm } from './taskEditForm'

export type ITaskEditFormikValues = {
    id: string
    name: string
    description: string
    boardId: string
    statusName: string
    elapsedTime: number
    estimatedTime: number
}

interface ITaskEditProps {
    task: Task
    status: Status
    isOpen: boolean
    onClose: () => void
}

export function TaskEdit(props: ITaskEditProps) {
    const { isOpen, onClose, status, task } = props
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync } = useMutation((values: ITaskEditFormikValues) => {
        return axios.post(`${API_URL}/task/edit`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const onSubmit = useCallback(
        (
            values: ITaskEditFormikValues,
            actions: FormikHelpers<ITaskEditFormikValues>
        ) => {
            mutateAsync(values).then(() => {
                actions.setSubmitting(false)
                onClose()
                refetchBoards.fetch()
            })
        },
        [mutateAsync, onClose, refetchBoards]
    )

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit your task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <TaskEditForm
                        task={task}
                        status={status}
                        onClose={onClose}
                        onTaskSubmit={onSubmit}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
