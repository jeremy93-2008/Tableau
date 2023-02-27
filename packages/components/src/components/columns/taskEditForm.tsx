import { Formik, FormikHelpers } from 'formik'
import { TextInput } from '../textInput'
import {
    Button,
    ButtonGroup,
    Flex,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { ITaskEditFormikValues } from './taskEdit'
import { Task } from '.prisma/client'
import { IFullStatus } from '../../types/types'
import { BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from './modal/deleteModal'

interface ITaskEditForm {
    task: Task
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
            order: task.order || 999,
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
                        <TextInput
                            label="Name"
                            name="name"
                            value={props.values.name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            style={
                                props.errors.name
                                    ? {
                                          backgroundColor:
                                              'var(--chakra-colors-red-200)',
                                      }
                                    : {}
                            }
                        />
                        {props.errors.name ? (
                            <Flex alignItems="center" color="red.500" ml="2">
                                <WarningIcon />
                                <Text fontSize="13px" m="1">
                                    Task Name is required
                                </Text>
                            </Flex>
                        ) : null}
                        <VStack mb={4} />
                        <TextInput
                            type="textarea"
                            label="Description"
                            name="description"
                            value={props.values.description}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                        <VStack mb={4} />
                        <TextInput
                            type="number"
                            min={0}
                            label="Elapsed Time"
                            name="elapsedTime"
                            value={props.values.elapsedTime}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                        <VStack mb={4} />
                        <TextInput
                            type="number"
                            min={0}
                            label="Estimated Time"
                            name="estimatedTime"
                            value={props.values.estimatedTime}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                        <ButtonGroup
                            display="flex"
                            justifyContent="space-between"
                            mt="6"
                        >
                            <ButtonGroup
                                display="flex"
                                justifyContent="flex-start"
                            >
                                <Button
                                    data-cy="buttonEditDelete"
                                    onClick={() => onOpenModal()}
                                    leftIcon={<BsTrashFill />}
                                    colorScheme="red"
                                    mr={1}
                                >
                                    Delete
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <Button onClick={onClose}>Cancel</Button>
                                <Button
                                    data-cy="buttonEditSave"
                                    type="submit"
                                    colorScheme="teal"
                                    mr={1}
                                >
                                    Save
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
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
