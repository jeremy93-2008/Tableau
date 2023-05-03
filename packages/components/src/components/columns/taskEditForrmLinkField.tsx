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
import { SingleInputModal } from './modal/singleInputModal'
import { IFullTask } from 'shared-types'

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
            <SingleInputModal
                isOpen={isOpen}
                onClose={onClose}
                title={'Add a Link'}
                description={'Name'}
                defaultValue={''}
                onSubmit={onSubmitLink}
                validationValueSchema={z.string().min(3)}
            />
        </Flex>
    )
}
