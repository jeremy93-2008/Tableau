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
import { useMutation } from '@tanstack/react-query'

import { API_URL } from '../../../../../constants/url'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { BsFillPencilFill } from 'react-icons/bs'
import { BoardEditForm, IBoardEditFormikValues } from './boardEditForm'
import { useAtom } from 'jotai'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface IBoardEditProps {
    isVisible: boolean
    singleBoard: IBoardWithAllRelation
}

export function BoardEdit(props: IBoardEditProps) {
    const { isVisible, singleBoard } = props
    const [refetchBoard] = useAtom(RefetchBoardAtom)
    const { data: session } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutateAsync } = useMutation((values: IBoardEditFormikValues) => {
        return axios.post(`${API_URL}/board/edit`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

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
                        <Tooltip label="Edit current board">
                            <PopoverTrigger>
                                <IconButton
                                    onClick={(evt) => evt.stopPropagation()}
                                    colorScheme="teal"
                                    variant={isVisible ? 'solid' : 'ghost'}
                                    aria-label="Edit Board"
                                    icon={<BsFillPencilFill />}
                                    size="sm"
                                />
                            </PopoverTrigger>
                        </Tooltip>
                    </Box>
                </Tooltip>
                <PopoverContent bg="gray.50" p={5}>
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
