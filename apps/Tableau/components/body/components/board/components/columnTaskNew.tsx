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
import { IFullStatus } from '../../../../../types/types'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'
import { TASK_LIMIT } from 'shared-utils'

interface IColumnTaskNewProps {
    isVisible: boolean
    status: IFullStatus
}

export function ColumnTaskNew(props: IColumnTaskNewProps) {
    const { isVisible, status } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

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
                            selectedBoard!.Task!.length > TASK_LIMIT
                                ? 'Task limit reached. You have reached the maximum number of task (50). Please delete some existing tasks to create a new one.'
                                : 'Add a new task'
                        }
                    >
                        <Button
                            colorScheme="teal"
                            width="100%"
                            isDisabled={
                                selectedBoard!.Task!.length > TASK_LIMIT
                            }
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
            <PopoverContent bg="gray.50" p={5} color="gray.800">
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
