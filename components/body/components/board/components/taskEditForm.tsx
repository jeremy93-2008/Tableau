import { Formik, FormikHelpers } from 'formik'
import { TextInput } from '../../../../textInput'
import { Button, ButtonGroup, Flex, Text, VStack } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { ITaskEditFormikValues } from './taskEdit'
import { Task } from '.prisma/client'
import { IFullStatus } from '../../../../../types/types'

interface ITaskEditForm {
    task: Task
    status: IFullStatus
    onTaskSubmit: (
        values: ITaskEditFormikValues,
        actions: FormikHelpers<ITaskEditFormikValues>
    ) => void
    onClose: () => void
}

export function TaskEditForm(props: ITaskEditForm) {
    const { task, status, onTaskSubmit, onClose } = props

    const initialValues: ITaskEditFormikValues = useMemo(
        () => ({
            id: task.id,
            name: task.name || '',
            description: task.description || '',
            boardId: task.boardId || '',
            statusId: status.id,
            elapsedTime: task.elapsedTime || 0,
            estimatedTime: task.estimatedTime || 0,
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
            onTaskSubmit(values, actions)
        },
        [onTaskSubmit]
    )

    return (
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
                        justifyContent="flex-end"
                        mt="6"
                    >
                        <Button type="submit" colorScheme="teal" mr={1}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </form>
            )}
        </Formik>
    )
}
