import { Formik, FormikHelpers } from 'formik'
import { useDisclosure } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { ITaskEditFormikValues } from './taskEdit'
import { Task } from '.prisma/client'
import { IFullStatus, IFullTask } from 'shared-types'
import { DeleteModal } from './modal/deleteModal'
import { TaskEditFormHeader } from './components/taskEditForm/templates/taskEditForm.header'
import { TaskEditFormBody } from './components/taskEditForm/templates/taskEditForm.body'

interface ITaskEditForm {
    task: IFullTask
    status: IFullStatus
    onTaskEditSubmit: (
        values: ITaskEditFormikValues,
        actions: FormikHelpers<ITaskEditFormikValues>
    ) => void
    onTaskDelete: (task: Task) => void
    onClose: () => void
}

export function TaskEditForm(props: ITaskEditForm) {
    const { task, status, onTaskEditSubmit, onTaskDelete, onClose } = props

    const {
        isOpen: isOpenModal,
        onClose: onCloseModal,
        onOpen: onOpenModal,
    } = useDisclosure()

    const initialValues: ITaskEditFormikValues = useMemo(
        () => ({
            id: task.id,
            name: task.name || '',
            description: task.description || '',
            boardId: task.boardId || '',
            statusId: status.id,
            elapsedTime: task.elapsedTime || 0,
            estimatedTime: task.estimatedTime || 0,
            order: task.order ?? 999,
            assignedUserIds:
                task.assignedUsers.map(
                    (assignedUser) => assignedUser.User.id
                ) ?? undefined,
            startDate: task.startDate ? new Date(task.startDate) : null,
            endDate: task.endDate ? new Date(task.endDate) : null,
        }),
        [task, status]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                id: Yup.string().required('Task Id is required'),
                name: Yup.string().required('Task Name is required'),
                description: Yup.string(),
                boardId: Yup.string().required('Board Id is required'),
                statusId: Yup.string().required('Status Id is required'),
                elapsedTime: Yup.number(),
                estimatedTime: Yup.number(),
                assignedUserIds: Yup.array(Yup.string()).nullable(),
                startDate: Yup.date().nullable(),
                endDate: Yup.date().nullable(),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: ITaskEditFormikValues,
            actions: FormikHelpers<ITaskEditFormikValues>
        ) => {
            onTaskEditSubmit(values, actions)
        },
        [onTaskEditSubmit]
    )

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <TaskEditFormHeader task={task} form={props} />
                        <TaskEditFormBody
                            task={task}
                            form={props}
                            footer={{ onOpenModal, onClose }}
                        />
                    </form>
                )}
            </Formik>
            <DeleteModal
                title="Delete Task"
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onSubmit={() => {
                    onTaskDelete(task)
                    onCloseModal()
                    onClose()
                }}
            />
        </>
    )
}
