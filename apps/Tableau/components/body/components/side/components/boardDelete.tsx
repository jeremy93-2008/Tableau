import React, { useCallback } from 'react'
import axios from 'axios'
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react'
import { BsTrashFill } from 'react-icons/bs'

import { DeleteModal } from '../../modal/deleteModal'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'

interface IBoardDeleteProps {
    isVisible: boolean
    singleBoard: IBoardWithAllRelation
}

export function BoardDelete(props: IBoardDeleteProps) {
    const { isVisible, singleBoard } = props

    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutateAsync } = useTableauMutation(
        (board: IBoardWithAllRelation) => {
            return axios.post(`api/board/delete`, board, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onBoardDelete = useCallback(() => {
        mutateAsync(singleBoard).then(() => {
            onClose()
            setSelectedBoard(null)
            refetchBoards.fetch()
        })
    }, [mutateAsync, singleBoard, onClose, refetchBoards, setSelectedBoard])

    return (
        <>
            <Tooltip label="Delete current board">
                <IconButton
                    onClick={() => onOpen()}
                    colorScheme="teal"
                    _hover={{ bgColor: 'red.500', color: 'white' }}
                    variant={isVisible ? 'solid' : 'ghost'}
                    aria-label="Delete Board"
                    icon={<BsTrashFill />}
                    size="sm"
                    ml={2}
                />
            </Tooltip>
            <DeleteModal
                title="Delete Board"
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onBoardDelete}
            />
        </>
    )
}
