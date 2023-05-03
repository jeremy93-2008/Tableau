import { IFullTask } from 'shared-types'
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
import { InputModal } from './modal/inputModal'

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
            <InputModal
                isOpen={isOpen}
                onClose={onClose}
                title={'Add a Link'}
                description={['Name', 'URL']}
                defaultValue={['', '']}
                onSubmit={onSubmitLink}
                validationValueSchema={[z.string().min(3), z.string().url()]}
            />
        </Flex>
    )
}
