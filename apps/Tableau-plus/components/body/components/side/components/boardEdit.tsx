import React, { useCallback } from 'react'
import axios from 'axios'
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

import { useSession } from 'next-auth/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { BsFillPencilFill } from 'react-icons/bs'
import { BoardEditForm, IBoardEditFormikValues } from './boardEditForm'
import { useAtom } from 'jotai'
import { RefetchBoardAtom } from 'shared-atoms'
import { useTableauMutation, useThemeMode } from 'shared-hooks'

interface IBoardEditProps {
    isDisabled: boolean
    isVisible: boolean
    singleBoard: IBoardWithAllRelation
}

export function BoardEdit(props: IBoardEditProps) {
    const { isVisible, isDisabled, singleBoard } = props
    const [refetchBoard] = useAtom(RefetchBoardAtom)
    const { data: session } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { bg } = useThemeMode()

    const { mutateAsync } = useTableauMutation(
        (values: IBoardEditFormikValues) => {
            return axios.post(`api/board/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onSubmit = useCallback(
        (
            values: IBoardEditFormikValues,
            actions: FormikHelpers<IBoardEditFormikValues>
        ) => {
            mutateAsync(values).then((json) => {
                actions.setSubmitting(false)
                onClose()
                refetchBoard.fetch()
            })
        },
        [mutateAsync, onClose, refetchBoard]
    )

    return (
        <>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <Tooltip label="Edit current board" isDisabled={!session}>
                    <Box>
                        <PopoverTrigger>
                            <IconButton
                                onClick={(evt) => evt.stopPropagation()}
                                colorScheme="teal"
                                isDisabled={isDisabled}
                                variant={isVisible ? 'solid' : 'ghost'}
                                aria-label="Edit Board"
                                icon={<BsFillPencilFill />}
                                size="sm"
                            />
                        </PopoverTrigger>
                    </Box>
                </Tooltip>
                <PopoverContent bg={bg.modal} p={5}>
                    <PopoverHeader color="gray.800" fontWeight="semibold">
                        Edit current Board
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Stack color="gray.800" spacing={4}>
                            <BoardEditForm
                                board={singleBoard}
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
