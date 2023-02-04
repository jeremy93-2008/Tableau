import {
    Button,
    ButtonGroup,
    Flex,
    IconButton,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import { Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextInput } from '../textInput'
import { IFullStatus } from '../../types/types'
import { BsTrashFill } from 'react-icons/bs'

export type IColumnEditFormikValues = {
    id: string
    statusName: string
    oldStatusName: string
}

interface IColumnEditProps {
    statusBoard: IFullStatus
    onClose: () => void
    onOpenDeleteModal: () => void
    onSubmit: (
        values: IColumnEditFormikValues,
        actions: FormikHelpers<IColumnEditFormikValues>
    ) => void
}

export function ColumnEditForm(props: IColumnEditProps) {
    const {
        statusBoard,
        onOpenDeleteModal,
        onClose,
        onSubmit: onColumnSubmit,
    } = props

    const initialValues = useMemo(
        () => ({
            id: statusBoard?.id,
            statusName: statusBoard.status.name,
            oldStatusName: statusBoard.status.name,
        }),
        [statusBoard]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                id: Yup.string().required(),
                statusName: Yup.string().required('Name Required'),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: IColumnEditFormikValues,
            actions: FormikHelpers<IColumnEditFormikValues>
        ) => {
            onColumnSubmit(values, actions)
        },
        [onColumnSubmit]
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
                    <input type="hidden" value={props.values.id} />
                    <TextInput
                        label="Status Name"
                        name="statusName"
                        value={props.values.statusName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={
                            props.errors.statusName
                                ? {
                                      backgroundColor:
                                          'var(--chakra-colors-red-200)',
                                  }
                                : {}
                        }
                    />
                    {props.errors.statusName ? (
                        <Flex alignItems="center" color="red.500" ml="2">
                            <WarningIcon />
                            <Text fontSize="13px" m="1">
                                Status Name is required
                            </Text>
                        </Flex>
                    ) : null}
                    <ButtonGroup
                        display="flex"
                        justifyContent="space-between"
                        mt="6"
                    >
                        <ButtonGroup display="flex" justifyContent="flex-start">
                            <Tooltip label="Delete this column">
                                <IconButton
                                    onClick={() => onOpenDeleteModal()}
                                    aria-label="Delete a Column"
                                    icon={<BsTrashFill />}
                                    colorScheme="red"
                                    mr={1}
                                />
                            </Tooltip>
                        </ButtonGroup>
                        <ButtonGroup display="flex" justifyContent="flex-end">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                type="submit"
                                colorScheme={props.isValid ? 'teal' : 'red'}
                                mr={1}
                            >
                                Save
                            </Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </form>
            )}
        </Formik>
    )
}
