import axios from 'axios'
import { IconButton, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import React, { useCallback } from 'react'
import { IFullStatus } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '../../../../../constants/url'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface IColumnMoveValues {
    id: string
    prevOrder: string
    nextOrder: string
}

interface IColumnTaskMoveProps {
    statusBoard: IFullStatus
}

export function ColumnTaskMove(props: IColumnTaskMoveProps) {
    const { statusBoard } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync } = useMutation((values: IColumnMoveValues) => {
        return axios.post(`${API_URL}/column/move`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const handleColumnMove = useCallback(
        (type: 'add' | 'substract') => () => {
            const statusLength = Number(selectedBoard?.Status.length ?? 4)
            mutateAsync({
                id: statusBoard.id,
                prevOrder: statusBoard.order,
                nextOrder: (type === 'add'
                    ? statusLength
                    : statusLength - 2
                ).toString(),
            }).then(() => {
                refetchBoards.fetch()
            })
        },
        [mutateAsync, statusBoard, selectedBoard, refetchBoards]
    )

    return (
        <>
            {Number(statusBoard.order) > 0 && (
                <Tooltip label="Move Column to the Left">
                    <IconButton
                        onClick={handleColumnMove('substract')}
                        size="sm"
                        colorScheme="teal"
                        aria-label="Move Column to the Left"
                        icon={<ArrowBackIcon />}
                    />
                </Tooltip>
            )}
            {Number(statusBoard.order) <
                Number(selectedBoard?.Status.length ?? 4) - 1 && (
                <Tooltip label="Move Column to the Right">
                    <IconButton
                        onClick={handleColumnMove('add')}
                        size="sm"
                        ml={2}
                        colorScheme="teal"
                        aria-label="Move Column to the Right"
                        icon={<ArrowForwardIcon />}
                    />
                </Tooltip>
            )}
        </>
    )
}
