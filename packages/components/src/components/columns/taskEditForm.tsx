import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import { TextInput } from '../textInput'
import {
    Button,
    ButtonGroup,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { AddIcon, WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { ITaskEditFormikValues } from './taskEdit'
import { Task } from '.prisma/client'
import { IFullStatus, IFullTask } from 'shared-types'
import { BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from './modal/deleteModal'
import { TaskEditFormAssignedUser } from './taskEditFormAssignedUser'
import { TaskEditFormChecklistGroup } from './taskEditFormChecklistGroup'
import { TaskEditFormChecklistField } from './taskEditFormChecklistField'

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
            order: task.order || 999,
            assignedUserId: task.assignedUserId ?? undefined,
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
                assignedUserId: Yup.string().nullable(),
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
                        <Flex
                            position="absolute"
                            top={4}
                            right="85px"
                            flexDirection="column"
                        >
                            <TaskEditFormAssignedUser
                                assignedUserId={props.values.assignedUserId}
                                setAssignedUser={(
                                    assignedUserId: string | null
                                ) => {
                                    props.setValues({
                                        ...props.values,
                                        assignedUserId:
                                            assignedUserId ?? undefined,
                                    })
                                }}
                            />
                        </Flex>
                        <Flex maxH="65vh" flexDirection="column">
                            <Flex
                                minH={0}
                                flex={1}
                                onWheel={(evt) => evt.stopPropagation()}
                                overflowY="auto"
                                flexDirection="column"
                            >
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
                                    <Flex
                                        alignItems="center"
                                        color="red.500"
                                        ml="2"
                                    >
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
                                <Flex mt={4}>
                                    <TaskEditFormChecklistField task={task} />
                                </Flex>
                                <Flex mt={4} gap={2}>
                                    <TextInput
                                        type="number"
                                        min={0}
                                        label="Elapsed Time"
                                        name="elapsedTime"
                                        value={props.values.elapsedTime}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    <TextInput
                                        type="number"
                                        min={0}
                                        label="Estimated Time"
                                        name="estimatedTime"
                                        value={props.values.estimatedTime}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Flex>
                            </Flex>
                            <ButtonGroup
                                display="flex"
                                flex="0"
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
                        </Flex>
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
