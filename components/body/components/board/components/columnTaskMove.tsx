import React, { useCallback, useMemo } from 'react'
import axios from 'axios'
import { IconButton, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IFullStatus } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'

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

    const { mutateAsync } = useTableauMutation((values: IColumnMoveValues) => {
        return axios.post(`api/column/move`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const sortedColumns = useMemo(() => {
        return selectedBoard?.Status.sort((a, b) => a.order - b.order)
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
        [mutateAsync, statusBoard, getAffectedColumn, refetchBoards]
    )

    return (
        <>
            {statusBoard.order > 0 && (
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
            {statusBoard.order < (selectedBoard?.Status.length ?? 999) - 1 && (
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
