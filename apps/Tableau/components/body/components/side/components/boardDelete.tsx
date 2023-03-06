import React, { useCallback } from 'react'
import axios from 'axios'
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react'
import { BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from 'shared-components'
import { useTableauMutation, useTableauRoute } from 'shared-hooks'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom, HashEntryAtom, RefetchBoardAtom } from 'shared-atoms'

interface IBoardDeleteProps {
    isDisabled: boolean
    isVisible: boolean
    singleBoard: IBoardWithAllRelation
}

export function BoardDelete(props: IBoardDeleteProps) {
    const { isVisible, isDisabled, singleBoard } = props

    const [selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [_pendingHashEntry, setPendingHashEntry] = useAtom(HashEntryAtom)
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

    const { pushReset } = useTableauRoute()

    const onBoardDelete = useCallback(() => {
        mutateAsync(singleBoard).then(() => {
            onClose()
            refetchBoards.fetch()
            if (selectedBoard?.id !== singleBoard.id) return
            setPendingHashEntry(null)
            pushReset()
            setSelectedBoard(null)
        })
    }, [
        mutateAsync,
        singleBoard,
        onClose,
        refetchBoards,
        selectedBoard?.id,
        setPendingHashEntry,
        pushReset,
        setSelectedBoard,
    ])

    return (
        <>
            <Tooltip label="Delete current board">
                <IconButton
                    data-cy="boardDelete"
                    onClick={(evt) => {
                        onOpen()
                        evt.stopPropagation()
                    }}
                    colorScheme="teal"
                    isDisabled={isDisabled}
                    _hover={
                        isDisabled ? {} : { bgColor: 'red.500', color: 'white' }
                    }
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
