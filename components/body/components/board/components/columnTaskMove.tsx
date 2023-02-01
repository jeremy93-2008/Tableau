import React, { useCallback, useMemo } from 'react'
import axios from 'axios'
import { IconButton, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IFullStatus } from '../../../../../types/types'
import { useAtom } from 'jotai'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'
import { useTableauMutation } from '../../../../../hooks/useTableauMutation'
import { useSwapEntity } from '../../../../../hooks/useSwapEntity'
import { StatusBoard } from '.prisma/client'

interface IColumnTaskMoveProps {
    statusBoard: IFullStatus
}

export function ColumnTaskMove(props: IColumnTaskMoveProps) {
    const { statusBoard } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoard] = useAtom(RefetchBoardAtom)

    const { mutateAsync } = useTableauMutation((values: IFullStatus[]) => {
        return axios.post(`api/columns/order`, values, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const orderedColumns = useMemo(() => {
        return selectedBoard?.Status.sort((a, b) => a.order - b.order)
    }, [selectedBoard])

    const currentIndexColumn = useMemo(() => {
        return orderedColumns?.findIndex((col) => col.id === statusBoard.id)
    }, [orderedColumns, statusBoard])

    const { swapEntity: swapColumn } = useSwapEntity(orderedColumns)

    const handleColumnMove = useCallback(
        (type: 'add' | 'subtract') => {
            return () => {
                if (!orderedColumns || currentIndexColumn == null) return
                const index = currentIndexColumn

                const nextIndexAdd =
                    orderedColumns.length === index + 1
                        ? orderedColumns.length - 1
                        : index + 1

                const nextIndexSubtract = index - 1 < 0 ? 0 : index - 1

                const nextColumn =
                    type === 'add'
                        ? orderedColumns[nextIndexAdd]
                        : orderedColumns[nextIndexSubtract]

                const newOrderedColumns = swapColumn(statusBoard, nextColumn)

                if (!newOrderedColumns) return

                mutateAsync(newOrderedColumns).then(() => {
                    refetchBoard.fetch()
                })
            }
        },
        [
            mutateAsync,
            orderedColumns,
            swapColumn,
            statusBoard,
            refetchBoard,
            currentIndexColumn,
        ]
    )

    return (
        <>
            {currentIndexColumn! > 0 && (
                <Tooltip label="Move Column to the Left">
                    <IconButton
                        onClick={handleColumnMove('subtract')}
                        size="sm"
                        colorScheme="teal"
                        aria-label="Move Column to the Left"
                        icon={<ArrowBackIcon />}
                    />
                </Tooltip>
            )}
            {currentIndexColumn! < orderedColumns!.length - 1 && (
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
