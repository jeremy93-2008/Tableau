import React, { useCallback } from 'react'
import axios from 'axios'
import {
    Box,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { AddIcon } from '@chakra-ui/icons'
import { FormikHelpers } from 'formik'
import { ColumnNewForm, IColumnNewFormikValues } from './columnNewForm'
import { API_URL } from '../../../../../constants/url'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface IColumnNewProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export function ColumnNew(props: IColumnNewProps) {
    const { isOpen, onOpen, onClose } = props
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync } = useMutation((values: IColumnNewFormikValues) => {
        return axios.post(`${API_URL}/column/create`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const onSubmit = useCallback(
        (
            values: IColumnNewFormikValues,
            actions: FormikHelpers<IColumnNewFormikValues>
        ) => {
            mutateAsync(values).then((json) => {
                actions.setSubmitting(false)
                onClose()
                refetchBoards.fetch()
            })
        },
        [mutateAsync, refetchBoards, onClose]
    )

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <Tooltip label="Add new status column">
                <Box>
                    <PopoverTrigger>
                        <Flex
                            onClick={() => onOpen()}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            cursor="pointer"
                        >
                            <AddIcon w={12} h={12} />
                            <Text fontWeight="medium" mt={4}>
                                Add a Status Column
                            </Text>
                        </Flex>
                    </PopoverTrigger>
                </Box>
            </Tooltip>
            <PopoverContent bg="gray.50" p={5} color="gray.800">
                <PopoverHeader fontWeight="semibold">
                    Add new Status Column
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <Stack spacing={4}>
                        <ColumnNewForm onClose={onClose} onSubmit={onSubmit} />
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
