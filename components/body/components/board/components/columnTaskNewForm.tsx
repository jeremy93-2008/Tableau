import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
import { TextInput } from '../../../../textInput'
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { Status } from '.prisma/client'

export type ITaskNewFormikValues = {
    name: string
    description: string
    boardId: string
    statusName: string
}

interface IColumnTaskNewProps {
    status: Status
    onClose: () => void
    onSubmit: (
        values: ITaskNewFormikValues,
        actions: FormikHelpers<ITaskNewFormikValues>
    ) => void
}

export function ColumnTaskNewForm(props: IColumnTaskNewProps) {
    const { status, onClose, onSubmit: onTaskSubmit } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const initialValues: ITaskNewFormikValues = useMemo(
        () => ({
            name: 'Task 1',
            description: '',
            boardId: selectedBoard?.id || '',
            statusName: status.name,
        }),
        [selectedBoard]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                name: Yup.string().required('Task Name is required'),
                description: Yup.string(),
                boardId: Yup.string().required('Board Id is required'),
                statusName: Yup.string().required('Status Name is required'),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: ITaskNewFormikValues,
            actions: FormikHelpers<ITaskNewFormikValues>
        ) => {
            onTaskSubmit(values, actions)
        },
        [onTaskSubmit]
    )

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnMount
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
                                Name is required
                            </Text>
                        </Flex>
                    ) : null}
                    <TextInput
                        label="Description"
                        name="description"
                        value={props.values.description}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                    />
                    <ButtonGroup
                        display="flex"
                        justifyContent="flex-end"
                        mt="5"
                    >
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            colorScheme={props.isValid ? 'teal' : 'red'}
                            isDisabled={!props.isValid}
                            type="submit"
                        >
                            Save
                        </Button>
                    </ButtonGroup>
                </form>
            )}
        </Formik>
    )
}
