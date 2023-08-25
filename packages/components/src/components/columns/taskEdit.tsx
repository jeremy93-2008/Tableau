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
import { Task } from '.prisma/client'
import axios from 'axios'
import { useAtom } from 'jotai'
import { RefetchBoardAtom } from 'shared-atoms'
import { TaskEditForm } from './taskEditForm'
import { IFullStatus, IFullTask } from 'shared-types'
import { useTableauMutation } from 'shared-hooks'

export type ITaskEditFormikValues = {
    id: string
    name: string
    description: string
    boardId: string
    statusId: string
    elapsedTime: number
    estimatedTime: number
    order: number
    assignedUserIds?: string[]
    startDate?: Date | null
    endDate?: Date | null
}

interface ITaskEditProps {
    task: IFullTask
    status: IFullStatus
    isOpen: boolean
    onClose: () => void
}

export function TaskEdit(props: ITaskEditProps) {
    const { isOpen, onClose, status, task } = props
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (values: ITaskEditFormikValues) => {
            return axios.post(`api/task/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (value: Task) => {
            return axios.post(
                `api/task/delete`,
                { id: value.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            )
        }
    )

    const onEdit = useCallback(
        (
            values: ITaskEditFormikValues,
            actions: FormikHelpers<ITaskEditFormikValues>
        ) => {
            mutateEditAsync(values).then(() => {
                actions.setSubmitting(false)
                onClose()
                refetchBoards.fetch()
            })
        },
        [mutateEditAsync, onClose, refetchBoards]
    )

    const onDelete = useCallback(
        (task: Task) => {
            mutateDeleteAsync(task).then(() => {
                onClose()
                refetchBoards.fetch()
            })
        },
        [mutateDeleteAsync, onClose, refetchBoards]
    )

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader mb={-2}>Edit your task</ModalHeader>
                <ModalCloseButton />
                <ModalBody data-cy="taskEditForm">
                    <TaskEditForm
                        task={task}
                        status={status}
                        onClose={onClose}
                        onTaskEditSubmit={onEdit}
                        onTaskDelete={onDelete}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
