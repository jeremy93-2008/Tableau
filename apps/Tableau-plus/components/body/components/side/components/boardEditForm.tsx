import { Formik, FormikHelpers } from 'formik'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { TextInput } from 'shared-components'
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { IBoardWithAllRelation } from '../../../../../types/types'

export type IBoardEditFormikValues = {
    id: string
    name: string
    description: string
    backgroundUrl: string
}

interface IBoardEditFormProps {
    board: IBoardWithAllRelation
    onClose: () => void
    onSubmit: (
        values: IBoardEditFormikValues,
        actions: FormikHelpers<IBoardEditFormikValues>
    ) => void
}

export function BoardEditForm({
    board,
    onClose,
    onSubmit: onEditBoardSubmit,
}: IBoardEditFormProps) {
    const initialValues = useMemo(
        () => ({
            id: board.id,
            name: board.name,
            description: board.description ?? '',
            backgroundUrl: board.backgroundUrl,
        }),
        [board]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                id: Yup.string().required('ID Required'),
                name: Yup.string().required('Name Required'),
                description: Yup.string(),
                backgroundUrl: Yup.string(),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: IBoardEditFormikValues,
            actions: FormikHelpers<IBoardEditFormikValues>
        ) => {
            onEditBoardSubmit(values, actions)
        },
        [onEditBoardSubmit]
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
                                Board Name is required
                            </Text>
                        </Flex>
                    ) : null}
                    <Flex mt={3}>
                        <TextInput
                            label="Description"
                            name="description"
                            placeholder="Description"
                            value={props.values.description}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                    </Flex>
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
