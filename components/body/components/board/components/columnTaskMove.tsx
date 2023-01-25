import React, { useCallback, useMemo } from 'react'
import axios from 'axios'
import { IconButton, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IFullStatus } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '../../../../../constants/url'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

interface IColumnMoveValues {
    currentColumn: IFullStatus
    affectedColumn: IFullStatus
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

    const sortedColumns = useMemo(() => {
        return selectedBoard?.Status.sort(
            (a, b) => Number(a.order) - Number(b.order)
        )
    }, [selectedBoard])

    const getAffectedColumn = useCallback(
        (type: 'add' | 'substract') => {
            if (!sortedColumns) return
            const currentColumnIndex = sortedColumns.findIndex(
                (col) => col.order === statusBoard.order
            )
            if (!currentColumnIndex) return
            if (type === 'add') return sortedColumns[currentColumnIndex + 1]
            return sortedColumns[currentColumnIndex - 1]
        },
        [sortedColumns, statusBoard]
    )

    const handleColumnMove = useCallback(
        (type: 'add' | 'substract') => () => {
            const affectedColumn = getAffectedColumn(type) ?? statusBoard
            mutateAsync({
                currentColumn: statusBoard,
                affectedColumn,
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
