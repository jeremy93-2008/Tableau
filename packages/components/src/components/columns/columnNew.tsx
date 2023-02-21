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
import { useAtom } from 'jotai'
import { AddIcon } from '@chakra-ui/icons'
import { FormikHelpers } from 'formik'
import { ColumnNewForm, IColumnNewFormikValues } from './columnNewForm'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { useTableauMutation, useThemeMode } from 'shared-hooks'
import { COLUMN_LIMIT } from 'shared-utils'
import { noop } from '@chakra-ui/utils'

interface IColumnNewProps {
    isOpen: boolean
    isDisabled: boolean
    onOpen: () => void
    onClose: () => void
}

export function ColumnNew(props: IColumnNewProps) {
    const { isOpen, isDisabled, onOpen, onClose } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { bg, text } = useThemeMode()

    const { mutateAsync } = useTableauMutation(
        (values: IColumnNewFormikValues) => {
            return axios.post(`api/column/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

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
        <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <Tooltip
                label={!isDisabled ? 'Add new status column' : 'No allowed'}
            >
                <Box>
                    <PopoverTrigger>
                        <Flex
                            onClick={() => onOpen()}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            cursor={'pointer'}
                            pointerEvents={!isDisabled ? 'auto' : 'none'}
                        >
                            <AddIcon w={12} h={12} />
                            <Text fontWeight="medium" mt={4}>
                                Add a Status Column
                            </Text>
                        </Flex>
                    </PopoverTrigger>
                </Box>
            </Tooltip>
            <PopoverContent bg={bg.primary} p={5} color={text.primary}>
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
