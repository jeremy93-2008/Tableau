import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import { Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextInput } from '../textInput'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullStatus } from 'shared-types'

export type IColumnNewFormikValues = {
    id: string | undefined
    statusName: string
    isDefault: boolean
    order: number
}

interface IColumnNewProps {
    onClose: () => void
    onSubmit: (
        values: IColumnNewFormikValues,
        actions: FormikHelpers<IColumnNewFormikValues>
    ) => void
}

export function ColumnNewForm(props: IColumnNewProps) {
    const { onClose, onSubmit: onColumnSubmit } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const orderedColumns = useMemo(() => {
        return selectedBoard?.Status.sort(
            (a: IFullStatus, b: IFullStatus) => a.order - b.order
        )
    }, [selectedBoard])

    const initialValues = useMemo(
        () => ({
            id: selectedBoard?.id,
            statusName: 'Status',
            isDefault: false,
            order: orderedColumns?.length ?? 999,
        }),
        [selectedBoard, orderedColumns]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                id: Yup.string().required(),
                statusName: Yup.string().required('Name Required'),
                isDefault: Yup.boolean().required(),
                order: Yup.number().required(),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: IColumnNewFormikValues,
            actions: FormikHelpers<IColumnNewFormikValues>
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
                        justifyContent="flex-end"
                        mt="5"
                    >
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            data-cy="columnAddSave"
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
