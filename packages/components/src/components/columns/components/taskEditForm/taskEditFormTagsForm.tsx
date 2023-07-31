import { Flex, Text } from '@chakra-ui/react'
import { Formik, FormikHelpers } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { IFullTask } from 'shared-types'
import * as Yup from 'yup'
import { TextInput } from '../../../textInput'
import { ITagsEditFormikValues } from './taskEditFormTags'
import { ZodIssue } from 'zod'

interface ITaskEditFormTagsFormProps {
    values: ITagsEditFormikValues
    onFieldChange: (field: keyof ITagsEditFormikValues, value: string) => void
    error: Record<string, ZodIssue[]>
}

export function TaskEditFormTagsForm(props: ITaskEditFormTagsFormProps) {
    const { values, onFieldChange, error } = props

    return (
        <Flex flexDirection="column">
            <Flex flexDirection="column">
                <Text fontWeight="medium" mb={2}>
                    Color
                </Text>
                {/* Create circular container with specific colors*/}
                <Flex
                    mb={2}
                    style={
                        error?.color?.length > 0
                            ? { border: 'solid 1px #F56565' }
                            : {}
                    }
                >
                    {[
                        '#E53E3E',
                        '#DD6B20',
                        '#D69E2E',
                        '#38A169',
                        '#319795',
                        '#3182CE',
                        '#4C51BF',
                        '#6B46C1',
                        '#805AD5',
                        '#9F7AEA',
                        '#B794F4',
                    ].map((color) => (
                        <Flex
                            key={color}
                            width="20px"
                            height="20px"
                            borderRadius="50%"
                            backgroundColor={color}
                            mr={2}
                            cursor="pointer"
                            border={
                                values.color === color ? 'solid 2px' : 'none'
                            }
                            onClick={() => onFieldChange('color', color)}
                        />
                    ))}
                </Flex>
                {error?.color?.map((err) => (
                    <Text key={err.path.join('.')} color="red.500">
                        {err.message}
                    </Text>
                ))}
            </Flex>
            <TextInput
                label="Name"
                name="name"
                value={values.name}
                onChange={(evt) =>
                    onFieldChange(
                        'name',
                        (evt.target as HTMLInputElement).value
                    )
                }
                onBlur={() => {}}
                style={
                    error?.name?.length > 0
                        ? { border: 'solid 1px #F56565' }
                        : {}
                }
            />
            {error?.name?.map((err) => (
                <Text key={err.path.join('.')} color="red.500">
                    {err.message}
                </Text>
            ))}
        </Flex>
    )
}
