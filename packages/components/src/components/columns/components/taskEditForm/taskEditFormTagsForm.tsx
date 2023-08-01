import { Badge, Flex, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { TextInput } from '../../../textInput'
import { ITagsEditFormikValues } from './taskEditFormTags'
import { ZodIssue } from 'zod'
import { useTableauQuery } from 'shared-hooks'
import { Tag } from '@prisma/client'
import { IFullTask } from 'shared-types'

interface ITaskEditFormTagsFormProps {
    allTags: Tag[]
    task: IFullTask
    values: ITagsEditFormikValues
    onFieldChange: (field: keyof ITagsEditFormikValues, value: string) => void
    error: Record<string, ZodIssue[]>
}

export function TaskEditFormTagsForm(props: ITaskEditFormTagsFormProps) {
    const { allTags, task, values, onFieldChange, error } = props

    const allTagsValidated = useMemo(() => {
        return (
            allTags?.filter((tag) =>
                task.tags.every(
                    (t) => t.name !== tag.name && t.color !== tag.color
                )
            ) ?? []
        )
    }, [allTags, task.tags])

    const onFillTag = (tag: Tag) => {
        onFieldChange('name', tag.name)
        onFieldChange('color', tag.color)
    }

    return (
        <Flex flexDirection="column">
            {allTagsValidated.length > 0 && (
                <Flex flexDirection="column" mb={2}>
                    <Text fontWeight="medium">Existing Tags</Text>
                    <Flex
                        flex={1}
                        flexWrap="wrap"
                        width="100%"
                        minWidth={0}
                        mb={1}
                    >
                        {allTagsValidated.map((tag) => (
                            <Badge
                                key={tag.id}
                                mr={2}
                                mt={2}
                                cursor="pointer"
                                bgColor={tag.color}
                                borderRadius="5px"
                                onClick={() => onFillTag(tag)}
                                transition="transform .1s ease-in-out"
                                _active={{
                                    transform: 'scale(0.9)',
                                }}
                                p={1}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </Flex>
                </Flex>
            )}
            {error?.['already-exist-tag']?.map((err) => (
                <Text mb={1} key={err.path.join('.')} color="red.500">
                    {err.message}
                </Text>
            ))}
            <Flex flexDirection="column">
                <Text fontWeight="medium" mb={2}>
                    Color
                </Text>
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
