import React from 'react'
import {
    Box,
    Button,
    ButtonGroup,
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
import { TextInput } from '../../../../textInput'

import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'

import { API_URL } from '../../../../../constants/url'

export function BoardNew() {
    const { data: session } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data } = useMutation(() => {
        return fetch(`${API_URL}/board/create`, {
            method: 'POST',
            body: JSON.stringify({
                name: '',
                description: '',
                backgroundUrl: '',
            }),
        }).then((res) => res.json())
    })

    return (
        <>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
                <PopoverContent p={5}>
                    <PopoverHeader fontWeight="semibold">
                        Create a new Board
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Stack spacing={4}>
                            <TextInput
                                label="Name"
                                id="name"
                                defaultValue="Board 1"
                            />
                            <TextInput
                                label="Description"
                                id="description"
                                placeholder="Description"
                            />
                            <ButtonGroup
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme="teal">Save</Button>
                            </ButtonGroup>
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
