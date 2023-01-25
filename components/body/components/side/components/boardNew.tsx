import React, { useCallback } from 'react'
import { FormikHelpers } from 'formik'
import {
    Box,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'

import { BoardNewForm, IBoardNewFormikValues } from './boardNewForm'

import { createFetchOptions } from '../../../../../utils/createFetchOptions'

interface IBoardNewProps {
    onAfterSubmit: () => void
}

export function BoardNew(props: IBoardNewProps) {
    const { onAfterSubmit } = props
    const { data: session } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutateAsync } = useMutation((values: IBoardNewFormikValues) => {
        return fetch(
            `api/board/create`,
            createFetchOptions('POST', {
                name: values.name,
                description: values.description,
                backgroundUrl: values.backgroundUrl,
            })
        ).then((res) => res.json())
    })

    const onSubmit = useCallback(
        (
            values: IBoardNewFormikValues,
            actions: FormikHelpers<IBoardNewFormikValues>
        ) => {
            mutateAsync(values).then((json) => {
                actions.setSubmitting(false)
                onAfterSubmit()
                onClose()
            })
        },
        [mutateAsync, onAfterSubmit, onClose]
    )

    return (
        <>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <Tooltip label="Add new board" isDisabled={!session}>
                    <Box>
                        <PopoverTrigger>
                            <IconButton
                                aria-label="Add new board"
                                icon={<AddIcon />}
                                isDisabled={!session}
                            />
                        </PopoverTrigger>
                    </Box>
                </Tooltip>
                <PopoverContent bg="gray.50" p={5}>
                    <PopoverHeader fontWeight="semibold">
                        Create a new Board
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Stack spacing={4}>
                            <BoardNewForm
                                onClose={onClose}
                                onSubmit={onSubmit}
                            />
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
