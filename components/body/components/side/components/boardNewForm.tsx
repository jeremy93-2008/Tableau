import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { TextInput } from '../../../../textInput'
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { Formik, FormikHelpers, FormikValues } from 'formik'

export type IBoardNewFormikValues = {
    name: string
    description: string
    backgroundUrl: string
}

interface IBoardNewFormProps {
    onClose: () => void
    onSubmit: (
        values: IBoardNewFormikValues,
        actions: FormikHelpers<IBoardNewFormikValues>
    ) => void
}

export function BoardNewForm({
    onClose,
    onSubmit: onNewBoardSubmit,
}: IBoardNewFormProps) {
    const initialValues = useMemo(
        () => ({
            name: 'Board 1',
            description: '',
            backgroundUrl: '',
        }),
        []
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                name: Yup.string().required('Name Required'),
                description: Yup.string(),
                backgroundUrl: Yup.string(),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: IBoardNewFormikValues,
            actions: FormikHelpers<IBoardNewFormikValues>
        ) => {
            onNewBoardSubmit(values, actions)
        },
        []
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
                    <TextInput
                        label="Description"
                        name="description"
                        placeholder="Description"
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
