import React, { useCallback, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Flex, Text } from '@chakra-ui/react'
import { BoardList } from './boardList'
import { BoardNew } from './boardNew'
import { BoardAtom } from '../../../../../atoms/boardAtom'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { RefetchBoardAtom } from '../../../../../atoms/refetchBoardAtom'

export function BoardSide() {
  const { data: session } = useSession()
  const [selectedBoard, setBoard] = useAtom(BoardAtom)
  const [_refetchBoards, setRefetchBoard] = useAtom(RefetchBoardAtom)
  const { data, refetch } = useQuery<IBoardWithAllRelation[]>(
    ['/board/list'],
    {
      enabled: !!session,
    }
  )

  const onAfterSubmit = useCallback(() => {
    refetch().then()
  }, [refetch])

  const onItemClick = useCallback(
    (board: IBoardWithAllRelation) => {
      if (selectedBoard?.id === board.id) return
      setBoard(board)
      setRefetchBoard({ fetch: onAfterSubmit })
    },
    [selectedBoard, setBoard, setRefetchBoard, onAfterSubmit]
  )

  useEffect(() => {
    if (!data) return
    const updatedSelectedBoard = data.find(d => d.id === selectedBoard?.id)
    if (!updatedSelectedBoard) return
    setBoard(updatedSelectedBoard)
  }, [data])

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
          <BoardNew onAfterSubmit={onAfterSubmit} />
        </Flex>
      </Flex>
      <BoardList listOfBoards={data} onItemClick={onItemClick} />
    </Flex>
  )
}
