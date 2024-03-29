import React, { useCallback } from 'react'
import axios from 'axios'
import {
    Box,
    Flex,
    IconButton,
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
    useDisclosure,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { FormikHelpers } from 'formik'
import { RefetchBoardAtom } from 'shared-atoms'
import { useTableauMutation, useThemeMode } from 'shared-hooks'
import { ColumnEditForm, IColumnEditFormikValues } from './columnEditForm'
import { BsFillPencilFill } from 'react-icons/bs'
import { DeleteModal } from './modal/deleteModal'
import { IFullStatus } from '../../types/types'

interface IColumnEditProps {
    statusBoard: IFullStatus
    isHoveringColumn: boolean
    isDisabled: boolean
}

export function ColumnEdit(props: IColumnEditProps) {
    const { statusBoard, isDisabled, isHoveringColumn } = props

    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isColumnDeleteOpen,
        onOpen: onOpenColumnDelete,
        onClose: onCloseColumnDelete,
    } = useDisclosure()

    const { bg, text } = useThemeMode()

    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync } = useTableauMutation(
        (values: IColumnEditFormikValues) => {
            return axios.post(`api/column/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateColumnDeleteAsync } = useTableauMutation(
        (values: IFullStatus) => {
            return axios.post(
                `api/column/delete`,
                { id: values.id, statusId: values.status.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            )
        }
    )

    const onDeleteColumn = useCallback(
        (column: IFullStatus) => {
            mutateColumnDeleteAsync(column).then(() => {
                onCloseColumnDelete()
                refetchBoards.fetch()
            })
        },
        [mutateColumnDeleteAsync, onCloseColumnDelete, refetchBoards]
    )

    const onSubmit = useCallback(
        (
            values: IColumnEditFormikValues,
            actions: FormikHelpers<IColumnEditFormikValues>
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
        <>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <Tooltip label="Edit status column">
                    <Box>
                        <PopoverTrigger>
                            <Flex onClick={() => onOpen()}>
                                {(isHoveringColumn || isOpen) && (
                                    <Tooltip label="Edit this column">
                                        <IconButton
                                            data-cy="columnEdit"
                                            aria-label={'Edit this column'}
                                            colorScheme="teal"
                                            size="sm"
                                            isDisabled={isDisabled}
                                            icon={<BsFillPencilFill />}
                                        />
                                    </Tooltip>
                                )}
                            </Flex>
                        </PopoverTrigger>
                    </Box>
                </Tooltip>
                <PopoverContent
                    data-cy="columnEditForm"
                    bg={bg.modal}
                    zIndex="popover"
                    p={5}
                    color={text.primary}
                >
                    <PopoverHeader fontWeight="semibold">
                        Edit Status Column
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Stack spacing={4}>
                            <ColumnEditForm
                                statusBoard={statusBoard}
                                onOpenDeleteModal={onOpenColumnDelete}
                                onClose={onClose}
                                onSubmit={onSubmit}
                            />
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <DeleteModal
                title="Delete Column"
                isOpen={isColumnDeleteOpen}
                onClose={onCloseColumnDelete}
                onSubmit={() => {
                    onDeleteColumn(statusBoard)
                }}
            />
        </>
    )
}
