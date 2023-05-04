import {
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { z } from 'zod'
import { FormModal } from './modal/formModal'
import { IFullTask } from 'shared-types'
import { TextInput } from '../textInput'

interface ITaskEditFormLinkField {
    task: IFullTask
}
export function TaskEditFormLinkField(props: ITaskEditFormLinkField) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onSubmitLink = useCallback(() => {}, [])

    return (
        <Flex>
            <Text fontWeight="medium" mr={2}>
                Links
            </Text>
            <Tooltip label="Add a Link">
                <IconButton
                    onClick={onOpen}
                    aria-label="Add a Link"
                    icon={<AddIcon />}
                    size="xs"
                />
            </Tooltip>
            <FormModal
                title={'Add a Link'}
                isOpen={isOpen}
                onClose={onClose}
                defaultValues={{ name: '', url: '' }}
                onSubmit={onSubmitLink}
                validationSchema={z.object({
                    name: z.string().min(3),
                    url: z.string().url(),
                })}
            >
                {({ values, onFieldChange, error }) => (
                    <Flex flexDirection="column" gap={3}>
                        <Text color="red">{JSON.stringify(error)}</Text>
                        <TextInput
                            name="nameInput"
                            label="Name"
                            value={values.name}
                            onChange={(evt) =>
                                onFieldChange(
                                    'name',
                                    (evt.target as HTMLInputElement).value
                                )
                            }
                            onBlur={() => {}}
                        />
                        <TextInput
                            name="urlInput"
                            label="URL"
                            value={values.url}
                            onChange={(evt) =>
                                onFieldChange(
                                    'url',
                                    (evt.target as HTMLInputElement).value
                                )
                            }
                            onBlur={() => {}}
                        />
                    </Flex>
                )}
            </FormModal>
        </Flex>
    )
}
