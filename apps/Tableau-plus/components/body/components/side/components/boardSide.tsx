import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { BoardList } from './boardList'
import { BoardNew } from './boardNew'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { BoardAtom, RefetchBoardAtom, SidePanelAtom } from 'shared-atoms'
import { useTableauQuery } from 'shared-hooks'
import { BiRefresh } from 'react-icons/bi'
import { getAnimation } from 'shared-utils'

export function BoardSide() {
    const { data: session } = useSession()
    const [selectedBoard, setBoard] = useAtom(BoardAtom)

    const [isOpenSidePanel, setIsOpenSidePanel] = useAtom(SidePanelAtom)

    const [_refetchBoards, setRefetchBoard] = useAtom(RefetchBoardAtom)

    const { data, refetch, isRefetching } = useTableauQuery<
        IBoardWithAllRelation[]
    >(['api/board/list'], {
        enabled: !!session,
        refetchInterval: 6000,
    })

    const onAfterSubmit = useCallback(() => {
        refetch().then()
    }, [refetch])

    const onItemClick = useCallback(
        (board: IBoardWithAllRelation) => {
            if (selectedBoard?.id === board.id) return
            setBoard(board)
            setRefetchBoard({ fetch: onAfterSubmit })
            setIsOpenSidePanel(false)
        },
        [
            selectedBoard,
            setBoard,
            setRefetchBoard,
            onAfterSubmit,
            setIsOpenSidePanel,
        ]
    )

    const [isRefreshAnimate, setIsRefreshAnimate] = useState(false)
    const { spiningAnimation } = getAnimation()

    const onRefreshClick = useCallback(() => {
        setIsRefreshAnimate(true)
        refetch().then()
        window.setTimeout(() => {
            setIsRefreshAnimate(false)
        }, 500)
    }, [refetch])

    useEffect(() => {
        if (!data) return
        const updatedSelectedBoard = data.find(
            (d) => d.id === selectedBoard?.id
        )
        if (!updatedSelectedBoard) return
        setBoard(updatedSelectedBoard)
    }, [selectedBoard, data, setBoard])

    useEffect(() => {
        const handlePortalClick = (evt: MouseEvent) => {
            if (
                document
                    .getElementById('boardside-container')!
                    .contains(evt.target as Node)
            )
                return
            setIsOpenSidePanel(false)
        }
        if (isOpenSidePanel) {
            window.requestAnimationFrame(() => {
                window.addEventListener('click', handlePortalClick)
            })
        }
        return () => window.removeEventListener('click', handlePortalClick)
    }, [isOpenSidePanel, setIsOpenSidePanel])

    return (
        <Flex flexDirection="column" width="100%">
            <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2}
            >
                <Flex>
                    <Text fontWeight="bold" py={2}>
                        Your boards
                    </Text>
                </Flex>
                <Flex>
                    <Tooltip label="Refresh Boards">
                        <IconButton
                            onClick={onRefreshClick}
                            aria-label="Refresh Boards Data"
                            isDisabled={!session}
                            animation={isRefreshAnimate ? spiningAnimation : ''}
                            pointerEvents={isRefreshAnimate ? 'none' : 'auto'}
                            icon={<BiRefresh color="#666" size="22px" />}
                        />
                    </Tooltip>

                    <BoardNew boards={data} onAfterSubmit={onAfterSubmit} />
                </Flex>
            </Flex>
            {session && (
                <BoardList listOfBoards={data} onItemClick={onItemClick} />
            )}
        </Flex>
    )
}
