import React, { useCallback } from 'react'
import axios from 'axios'
import { useAtom } from 'jotai'
import {
    Box,
    Button,
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
import { ColumnTaskNewForm, ITaskNewFormikValues } from './columnTaskNewForm'
import { FormikHelpers } from 'formik'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { IFullStatus } from 'shared-types'
import { useTableauMutation, useThemeMode } from 'shared-hooks'
import { useTaskPermission } from '../../hooks/useTaskPermission'

interface IColumnTaskNewProps {
    isVisible: boolean
    status: IFullStatus
}

export function ColumnTaskNew(props: IColumnTaskNewProps) {
    const { isVisible, status } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { bg, text } = useThemeMode()

    const taskPermission = useTaskPermission()

    const { mutateAsync } = useTableauMutation(
        (values: ITaskNewFormikValues) => {
            return axios.post(`api/task/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onSubmit = useCallback(
        (
            values: ITaskNewFormikValues,
            actions: FormikHelpers<ITaskNewFormikValues>
        ) => {
            mutateAsync(values).then((json) => {
                actions.setSubmitting(false)
                onClose()
                refetchBoards.fetch()
            })
        },
        [mutateAsync, onClose, refetchBoards]
    )

    return (
        <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Box>
                    <Tooltip
                        label={
                            !taskPermission?.add
                                ? 'No Allowed'
                                : 'Add a new task'
                        }
                    >
                        <Button
                            data-cy="taskAdd"
                            colorScheme="teal"
                            width="100%"
                            isDisabled={!taskPermission?.add ?? false}
                            mt={2}
                            style={{
                                opacity: isVisible ? '1' : '0',
                            }}
                        >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </Box>
            </PopoverTrigger>
            <PopoverContent
                data-cy="taskAddForm"
                bg={bg.modal}
                zIndex="popover"
                p={5}
                color={text.primary}
            >
                <PopoverHeader fontWeight="semibold">
                    Add new Task
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <Stack spacing={4}>
                        <ColumnTaskNewForm
                            statusBoard={status}
                            onClose={onClose}
                            onSubmit={onSubmit}
                        />
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
